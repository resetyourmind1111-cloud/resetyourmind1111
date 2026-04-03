const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Determine if this is a single-user on-demand request or a batch cron run
    let targetUserIds: string[] = []
    let isCron = false

    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      if (body.user_id) {
        targetUserIds = [body.user_id]
      } else {
        isCron = true
      }
    }

    // For cron: get all users with weekly_coaching_enabled
    if (isCron) {
      const { data: prefs } = await supabase
        .from('notification_preferences')
        .select('user_id')
        .eq('weekly_coaching_enabled', true)

      if (prefs && prefs.length > 0) {
        targetUserIds = prefs.map((p: any) => p.user_id)
      }
    }

    if (targetUserIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No users to process' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results: any[] = []

    for (const userId of targetUserIds) {
      try {
        // Get user profile & email
        const { data: { user } } = await supabase.auth.admin.getUserById(userId)
        if (!user?.email) continue

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, current_streak, total_points, subscription_tier')
          .eq('user_id', userId)
          .maybeSingle()

        const firstName = profile?.full_name?.split(' ')[0] || 'there'

        // Aggregate last 7 days of activity
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

        const [
          { data: checkins },
          { data: journalEntries },
          { data: toolEntries },
          { data: cardPulls },
          { data: lessonCompletions },
          { data: permissionSlips },
          { data: thirtyDayProgress },
        ] = await Promise.all([
          supabase.from('user_checkins').select('daily_state, routed_to_module').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('nervous_system_checkins').select('primary_state, journal_entry, reset_completed').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('healing_tool_entries').select('tool_id, entry_data').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('card_pulls').select('reading_type, spread_name').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('lesson_completions').select('track_name, lesson_title').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('permission_slips_accepted').select('slip_text, category').eq('user_id', userId).gte('created_at', weekAgo),
          supabase.from('thirty_day_progress').select('day_number, phase, marked_complete').eq('user_id', userId).gte('created_at', weekAgo),
        ])

        // Build activity summary for AI
        const activitySummary = {
          checkinCount: checkins?.length || 0,
          checkinStates: checkins?.map(c => c.daily_state) || [],
          nervousSystemCheckins: journalEntries?.length || 0,
          nervousSystemStates: journalEntries?.map(j => j.primary_state) || [],
          journalEntriesWritten: journalEntries?.filter(j => j.journal_entry).length || 0,
          resetsCompleted: journalEntries?.filter(j => j.reset_completed).length || 0,
          healingToolsUsed: [...new Set(toolEntries?.map(t => t.tool_id) || [])],
          toolEntriesCount: toolEntries?.length || 0,
          oracleReadings: cardPulls?.length || 0,
          lessonsCompleted: lessonCompletions?.length || 0,
          lessonTracks: [...new Set(lessonCompletions?.map(l => l.track_name) || [])],
          permissionSlipsAccepted: permissionSlips?.length || 0,
          thirtyDayDaysCompleted: thirtyDayProgress?.filter(p => p.marked_complete).length || 0,
          currentStreak: profile?.current_streak || 0,
          totalPoints: profile?.total_points || 0,
        }

        // Generate AI coaching summary
        const aiPrompt = `You are a warm, empowering coach for a personal transformation platform called "Your Mind Reset." 
Write a personalized weekly coaching email summary for ${firstName}. 

Their activity this week:
- ${activitySummary.checkinCount} daily check-ins (emotional states: ${activitySummary.checkinStates.join(', ') || 'none'})
- ${activitySummary.nervousSystemCheckins} nervous system check-ins (states: ${activitySummary.nervousSystemStates.join(', ') || 'none'})
- ${activitySummary.journalEntriesWritten} journal entries written
- ${activitySummary.resetsCompleted} nervous system resets completed
- ${activitySummary.healingToolsUsed.length} different healing tools used: ${activitySummary.healingToolsUsed.join(', ') || 'none'}
- ${activitySummary.toolEntriesCount} total tool entries
- ${activitySummary.oracleReadings} oracle card readings
- ${activitySummary.lessonsCompleted} lessons completed across tracks: ${activitySummary.lessonTracks.join(', ') || 'none'}
- ${activitySummary.permissionSlipsAccepted} permission slips accepted
- ${activitySummary.thirtyDayDaysCompleted} days completed in the 30-day experience
- Current streak: ${activitySummary.currentStreak} days
- Total points: ${activitySummary.totalPoints}

Write 4 sections (use plain text, no markdown):
1. "Your Week in Review" — celebrate what they did, be specific about the tools and activities
2. "Pattern I'm Noticing" — an insight about their emotional patterns or growth trajectory
3. "This Week's Invitation" — one specific thing to focus on next week based on what they haven't explored or could deepen
4. "Your Affirmation" — a personalized affirmation based on their journey

Keep each section to 2-3 sentences. Be warm, specific, and empowering. If they had low activity, be encouraging without guilt.`

        const aiResponse = await fetch('https://api.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lovableApiKey}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [{ role: 'user', content: aiPrompt }],
            max_tokens: 800,
          }),
        })

        if (!aiResponse.ok) {
          console.error('AI generation failed:', await aiResponse.text())
          continue
        }

        const aiData = await aiResponse.json()
        const coachingText = aiData.choices?.[0]?.message?.content || ''

        // Parse sections
        const sections = parseSections(coachingText)

        // Build HTML email
        const emailHtml = buildEmailHtml(firstName, sections, activitySummary)

        // Send via Resend
        const emailResponse = await fetch(`${GATEWAY_URL}/emails`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${lovableApiKey}`,
            'X-Connection-Api-Key': resendApiKey,
          },
          body: JSON.stringify({
            from: 'Your Mind Reset <onboarding@resend.dev>',
            to: [user.email],
            subject: `✨ ${firstName}, Your Weekly Coaching Summary`,
            html: emailHtml,
          }),
        })

        const emailResult = await emailResponse.json()
        results.push({ userId, email: user.email, status: 'sent', emailId: emailResult.id })
      } catch (userError) {
        console.error(`Error processing user ${userId}:`, userError)
        results.push({ userId, status: 'error', error: String(userError) })
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Weekly coaching summary error:', error)
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function parseSections(text: string) {
  const sections: Record<string, string> = {
    weekReview: '',
    pattern: '',
    invitation: '',
    affirmation: '',
  }

  const sectionKeys = [
    { key: 'weekReview', patterns: ['your week in review', 'week in review'] },
    { key: 'pattern', patterns: ["pattern i'm noticing", 'pattern i am noticing', 'pattern'] },
    { key: 'invitation', patterns: ["this week's invitation", 'invitation'] },
    { key: 'affirmation', patterns: ['your affirmation', 'affirmation'] },
  ]

  const lines = text.split('\n')
  let currentKey = ''

  for (const line of lines) {
    const lower = line.toLowerCase().replace(/[*#_]/g, '').trim()
    let matched = false
    for (const s of sectionKeys) {
      if (s.patterns.some(p => lower.includes(p))) {
        currentKey = s.key
        matched = true
        break
      }
    }
    if (!matched && currentKey && line.trim()) {
      sections[currentKey] += (sections[currentKey] ? ' ' : '') + line.trim()
    }
  }

  return sections
}

function buildEmailHtml(firstName: string, sections: Record<string, string>, stats: any) {
  const gold = '#C9A84C'
  const purple = '#3D1D6B'
  const darkBg = '#0A0A0A'
  const cardBg = '#141414'
  const textColor = '#E8DCC8'
  const mutedText = '#9A8C7A'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${darkBg};font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:${darkBg};padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="text-align:center;padding:30px 0 20px;">
  <h1 style="color:${gold};font-size:28px;margin:0;font-weight:400;letter-spacing:1px;">Your Mind Reset</h1>
  <p style="color:${mutedText};font-size:13px;margin:8px 0 0;text-transform:uppercase;letter-spacing:2px;">Weekly Coaching Summary</p>
</td></tr>

<!-- Greeting -->
<tr><td style="padding:20px 30px;">
  <p style="color:${textColor};font-size:18px;margin:0;">Hi ${firstName},</p>
  <p style="color:${mutedText};font-size:14px;margin:8px 0 0;">Here's your personalized coaching reflection for the past 7 days.</p>
</td></tr>

<!-- Stats Bar -->
<tr><td style="padding:10px 30px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${cardBg};border-radius:12px;border:1px solid ${gold}33;">
  <tr>
    <td style="padding:16px;text-align:center;width:25%;"><span style="color:${gold};font-size:22px;display:block;">${stats.checkinCount}</span><span style="color:${mutedText};font-size:11px;text-transform:uppercase;">Check-ins</span></td>
    <td style="padding:16px;text-align:center;width:25%;"><span style="color:${gold};font-size:22px;display:block;">${stats.toolEntriesCount}</span><span style="color:${mutedText};font-size:11px;text-transform:uppercase;">Tool Uses</span></td>
    <td style="padding:16px;text-align:center;width:25%;"><span style="color:${gold};font-size:22px;display:block;">${stats.lessonsCompleted}</span><span style="color:${mutedText};font-size:11px;text-transform:uppercase;">Lessons</span></td>
    <td style="padding:16px;text-align:center;width:25%;"><span style="color:${gold};font-size:22px;display:block;">${stats.currentStreak}</span><span style="color:${mutedText};font-size:11px;text-transform:uppercase;">Day Streak</span></td>
  </tr>
  </table>
</td></tr>

<!-- Week Review -->
<tr><td style="padding:15px 30px;">
  <table width="100%" style="background:${cardBg};border-radius:12px;border:1px solid ${gold}22;">
  <tr><td style="padding:20px 24px;">
    <p style="color:${gold};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">✦ Your Week in Review</p>
    <p style="color:${textColor};font-size:15px;line-height:1.7;margin:0;">${sections.weekReview || 'Keep showing up — every step counts.'}</p>
  </td></tr>
  </table>
</td></tr>

<!-- Pattern -->
<tr><td style="padding:5px 30px;">
  <table width="100%" style="background:${cardBg};border-radius:12px;border:1px solid ${purple}44;">
  <tr><td style="padding:20px 24px;">
    <p style="color:${gold};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">🔮 Pattern I'm Noticing</p>
    <p style="color:${textColor};font-size:15px;line-height:1.7;margin:0;">${sections.pattern || 'Patterns emerge with consistent practice.'}</p>
  </td></tr>
  </table>
</td></tr>

<!-- Invitation -->
<tr><td style="padding:5px 30px;">
  <table width="100%" style="background:${cardBg};border-radius:12px;border:1px solid ${gold}22;">
  <tr><td style="padding:20px 24px;">
    <p style="color:${gold};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">🌿 This Week's Invitation</p>
    <p style="color:${textColor};font-size:15px;line-height:1.7;margin:0;">${sections.invitation || 'Try exploring a new healing tool this week.'}</p>
  </td></tr>
  </table>
</td></tr>

<!-- Affirmation -->
<tr><td style="padding:15px 30px 30px;">
  <table width="100%" style="background:linear-gradient(135deg,${purple},${darkBg});border-radius:12px;border:1px solid ${gold}44;">
  <tr><td style="padding:28px 24px;text-align:center;">
    <p style="color:${gold};font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 14px;">✨ Your Affirmation</p>
    <p style="color:${textColor};font-size:18px;font-style:italic;line-height:1.6;margin:0;">"${sections.affirmation || 'I am worthy of the transformation I seek.'}"</p>
  </td></tr>
  </table>
</td></tr>

<!-- CTA -->
<tr><td style="padding:0 30px 30px;text-align:center;">
  <a href="https://your-mind-reset.lovable.app/dashboard" style="display:inline-block;background:${gold};color:${darkBg};padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Continue Your Journey</a>
</td></tr>

<!-- Footer -->
<tr><td style="padding:20px 30px;border-top:1px solid ${gold}22;text-align:center;">
  <p style="color:${mutedText};font-size:12px;margin:0;">You're receiving this because you have weekly coaching summaries enabled.</p>
  <p style="color:${mutedText};font-size:12px;margin:6px 0 0;">To turn off, visit <a href="https://your-mind-reset.lovable.app/my-account" style="color:${gold};">My Account</a> → Notifications.</p>
</td></tr>

</table>
</td></tr></table>
</body></html>`
}
