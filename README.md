# Reset Your Mind

# RESET YOUR MIND 1111™ - LOVABLE.DEV BUILD GUIDE
## Complete Step-by-Step Guide to Build Your Transformation App




**Platform:** Lovable.dev (AI-powered full-stack app builder)  
**Timeline:** 3-4 weeks from start to launch  
**Cost:** Free tier to test → $20/month Pro when ready  
**What You'll Build:** Production-ready transformation platform with subscription tiers




---




## 🎯 WHY LOVABLE FOR THIS PROJECT:




✅ **Real production code** - React/TypeScript you can own  
✅ **Supabase integration** - Enterprise-grade database & auth  
✅ **GitHub sync** - Professional version control  
✅ **One-click deploy** - Built-in hosting with custom domains  
✅ **Scalable** - Starts as MVP, grows into full business  
✅ **You own the code** - Not locked into platform




---




## 📋 BEFORE YOU START:




### 1. Sign Up for Lovable.dev
- Go to: https://lovable.dev
- Create account with your business email
- Start with **Free Plan** (30 credits/month to test)
- Upgrade to **Pro Plan ($20/month)** when ready to build seriously




### 2. Set Up Supabase (Free)
- Go to: https://supabase.com
- Create free account
- Create new project (select region close to you)
- Save your project URL and API keys (Lovable will use these)




### 3. Your Content (Already Complete!)
✅ 25 Worth Thermostat Assessment Questions  
✅ 52 Permission Granted Oracle Cards  
✅ 52 Abundance Oracle Cards  
✅ 34 Guided Meditations (Minddist URLs)  
✅ 30-Page Digital Workbook  
✅ 5 Thermostat Type Descriptions  
✅ Human Design Integration Content




---




## 🏗️ BUILD PHASES (Recommended Order):




**PHASE 1:** Foundation (Week 1)
- User authentication
- Subscription tiers ($33, $55, $111)
- User profile with Human Design




**PHASE 2:** Assessment (Week 2)
- Worth Thermostat Assessment (25 questions)
- Auto-scoring and result types
- Email capture and results




**PHASE 3:** Oracle Cards (Week 2-3)
- Permission Granted deck (52 cards)
- Abundance deck (52 cards)
- Card pull/spread system




**PHASE 4:** Meditations & Workbook (Week 3-4)
- Meditation library (34 meditations)
- Minddist integration
- Digital workbook (30 pages)




**PHASE 5:** Community & Features (Week 4)
- Progress tracking
- Streak system
- Community feed (optional)




---




## 💬 LOVABLE PROMPT 1: PROJECT FOUNDATION




**Copy/paste this into Lovable to start your project:**




```
Create a transformation coaching web app called "Reset Your Mind 1111" with these core features:




PROJECT STRUCTURE:
- Modern React with TypeScript
- Tailwind CSS for styling (purple/gold brand colors: #7C3AED primary, #F59E0B accent)
- Supabase for backend (authentication, database, storage)
- Responsive design (mobile-first)




AUTHENTICATION SYSTEM:
- Email/password signup and login
- Email verification required
- Password reset flow
- Protected routes for authenticated users only




USER PROFILE:
Create a user profile page with:
- Full name
- Email (non-editable, from auth)
- Phone number (optional)
- Profile photo upload
- Human Design type dropdown (Manifestor, Generator, Manifesting Generator, Projector, Reflector)
- Subscription tier (display only, managed separately)
- Current streak (days)
- Total points earned
- Date joined




SUBSCRIPTION TIERS:
Create 3 subscription tier options:




Tier 1: "Permission Granted - Mind" ($33/month)
- Access to Worth Thermostat Assessment
- Permission Granted Oracle Deck (52 cards)
- 10 Mind Meditations
- Basic workbook pages (1-10)
- Community access




Tier 2: "Complete Transformation" ($55/month)  
- Everything in Tier 1 PLUS:
- Abundance Oracle Deck (52 cards)
- All 34 Meditations (Mind, Soul, Body)
- Full workbook (all 30 pages)
- Advanced card spreads
- Priority support




Tier 3: "VIP Total Reset" ($111/month)
- Everything in Tier 2 PLUS:
- Human Design personalized reports
- Monthly group coaching calls
- 1:1 breakthrough session (quarterly)
- VIP-only content
- Direct messaging access




NAVIGATION:
Create a navigation bar with:
- Logo: "Reset Your Mind 1111™"
- Links: Home, Assessment, Oracle Cards, Meditations, Workbook, Profile
- Logout button (when authenticated)
- Mobile hamburger menu




LANDING PAGE (Public):
Hero section with:
- Headline: "Stop Settling for Crumbs. Choose Celebration."
- Subheading: "Discover your Worth Thermostat and recalibrate your life."
- CTA: "Take Free Assessment" (leads to assessment)
- Secondary CTA: "View Pricing"




Features section showcasing:
- Worth Thermostat Assessment
- Oracle Card Guidance  
- Guided Meditations
- Interactive Workbook




Pricing section with 3-tier comparison table




STYLING:
- Purple theme (#7C3AED for primary, #F59E0B for accents)
- Clean, modern, spa-like aesthetic
- Smooth animations and transitions
- Glassmorphism effects on cards
- Soft shadows and rounded corners




DATABASE SCHEMA (Supabase):
Create these tables:




users:
- id (uuid, primary key, from auth.users)
- full_name (text)
- phone (text, nullable)
- profile_photo_url (text, nullable)
- human_design_type (text, nullable)
- subscription_tier (text, default: 'free')
- stripe_customer_id (text, nullable)
- current_streak (integer, default: 0)
- total_points (integer, default: 0)
- last_login (timestamp)
- created_at (timestamp)




Build this foundation first, then we'll add the assessment, oracle cards, meditations, and workbook in subsequent prompts.
```




---




## 💬 LOVABLE PROMPT 2: WORTH THERMOSTAT ASSESSMENT




**After Prompt 1 is complete, add this:**




```
Add a Worth Thermostat Assessment feature with 25 questions across 5 categories.




ASSESSMENT FLOW:
1. Welcome screen explaining the assessment
2. 25 questions (one per screen, 5 questions per category)
3. Progress bar showing "Question X of 25"
4. Category indicators
5. Email capture before results
6. Personalized results page
7. Option to save results to profile (if logged in)




CATEGORIES:
1. Love & Relationships (Q1-5)
2. Money & Abundance (Q6-10)
3. Career & Purpose (Q11-15)
4. Self-Care & Boundaries (Q16-20)
5. Action & Manifestation (Q21-25)




QUESTION FORMAT:
Each question has 5 answer options (A-E):
- Option A = 1 point (Crumbs level)
- Option B = 2 points (Struggling)
- Option C = 3 points (Working on it)
- Option D = 4 points (Healthy)
- Option E = 5 points (Celebration)




Display as radio buttons with full text for each option.




ALL 25 QUESTIONS:




CATEGORY 1: LOVE & RELATIONSHIPS




Question 1: "When someone shows genuine interest in you, your first instinct is usually:"
A) To question what they really want or if there's a catch (1 point)
B) To feel flattered but assume it won't last (2 points)
C) To feel excited but nervous about being "too much" (3 points)
D) To feel open and curious about the connection (4 points)
E) To receive their interest as natural and deserved (5 points)




Question 2: "In relationships, you tend to:"
A) Give much more than you receive and feel drained (1 point)
B) Keep your guard up and rarely let people see the real you (2 points)
C) Alternate between being super giving and then pulling back (3 points)
D) Give and receive in natural flow with healthy boundaries (4 points)
E) Effortlessly maintain reciprocal, secure connections (5 points)




Question 3: "When conflict arises with someone you care about:"
A) You immediately assume you did something wrong (1 point)
B) You shut down or withdraw to avoid confrontation (2 points)
C) You try to fix everything and make everyone happy (3 points)
D) You stay centered and communicate your needs clearly (4 points)
E) You navigate conflict with confidence and emotional safety (5 points)




Question 4: "Your past relationships have mostly taught you:"
A) That love always comes with pain and disappointment (1 point)
B) That you have to be perfect to be loved (2 points)
C) That you attract unavailable or wounded people (3 points)
D) That healthy love is possible and you deserve it (4 points)
E) That you naturally attract secure, loving partnerships (5 points)




Question 5: "When someone treats you poorly:"
A) You make excuses for them and blame yourself (1 point)
B) You tolerate it longer than you should (2 points)
C) You feel angry but struggle to set clear boundaries (3 points)
D) You address it directly or remove yourself from the situation (4 points)
E) You maintain your worth and expect respectful treatment always (5 points)




CATEGORY 2: MONEY & ABUNDANCE




Question 6: "When you think about money, you usually feel:"
A) Anxious, stressed, or defeated (1 point)
B) Guilty or ashamed about wanting more (2 points)
C) Frustrated that others have it easier than you (3 points)
D) Neutral and capable of managing it well (4 points)
E) Abundant and confident in your ability to attract it (5 points)




Question 7: "When it comes to charging for your work or asking for a raise:"
A) You undercharge or avoid asking altogether (1 point)
B) You feel guilty charging what you're actually worth (2 points)
C) You charge something but always feel nervous about it (3 points)
D) You charge your worth and feel mostly comfortable (4 points)
E) You confidently charge premium rates and people gladly pay (5 points)




Question 8: "Your spending habits reflect:"
A) Scarcity - hoarding or deprivation (1 point)
B) Chaos - overspending then restricting (2 points)
C) People-pleasing - spending on others, not yourself (3 points)
D) Balance - enjoying money while saving responsibly (4 points)
E) Abundance - flowing easily with generosity and joy (5 points)




Question 9: "When unexpected money comes in (bonus, gift, windfall):"
A) You worry about when it will run out (1 point)
B) You feel you don't deserve it or it's a fluke (2 points)
C) You immediately give it away or spend it on others (3 points)
D) You receive it gratefully and use it wisely (4 points)
E) You celebrate it as natural and expect more to come (5 points)




Question 10: "Financial opportunities (investments, promotions, ventures):"
A) Feel scary and you usually avoid them (1 point)
B) Feel tempting but you talk yourself out of them (2 points)
C) Feel exciting but you need others' approval first (3 points)
D) Feel manageable and you evaluate them clearly (4 points)
E) Feel magnetic and you trust your intuition fully (5 points)




CATEGORY 3: CAREER & PURPOSE




Question 11: "In your career or calling, you:"
A) Feel stuck, invisible, or undervalued (1 point)
B) Work hard but feel like no one notices (2 points)
C) Have skills but struggle to show up confidently (3 points)
D) Feel aligned and are building momentum (4 points)
E) Feel magnetic, visible, and in your power (5 points)




Question 12: "When it's time to promote yourself or your work:"
A) You hide and hope someone discovers you (1 point)
B) You feel uncomfortable and avoid self-promotion (2 points)
C) You do it but minimize your achievements (3 points)
D) You share your wins with healthy confidence (4 points)
E) You celebrate your genius without apology (5 points)




Question 13: "Your relationship with visibility is:"
A) Terrifying - you actively avoid being seen (1 point)
B) Uncomfortable - you shrink to stay safe (2 points)
C) Conflicted - you want it but fear judgment (3 points)
D) Growing - you're learning to be seen authentically (4 points)
E) Natural - you shine without dimming for others (5 points)




Question 14: "When you share your gifts or talents:"
A) You downplay them or give them away for free (1 point)
B) You wait for permission or validation first (2 points)
C) You share but apologize or deflect praise (3 points)
D) You share with confidence and receive appreciation (4 points)
E) You share powerfully knowing your impact matters (5 points)




Question 15: "Your sense of purpose feels:"
A) Lost, unclear, or overwhelming (1 point)
B) Present but buried under obligations (2 points)
C) Emerging but you doubt if it's "enough" (3 points)
D) Clear and you're taking aligned action (4 points)
E) Magnetic and naturally unfolding with ease (5 points)




CATEGORY 4: SELF-CARE & BOUNDARIES




Question 16: "When you need rest or time for yourself:"
A) You feel guilty and push through exhaustion (1 point)
B) You wait until you're burned out or sick (2 points)
C) You take it but feel selfish doing so (3 points)
D) You honor your needs without excessive guilt (4 points)
E) You prioritize self-care as non-negotiable (5 points)




Question 17: "Your boundaries with others are:"
A) Nonexistent - you say yes to everything (1 point)
B) Weak - you set them but don't enforce them (2 points)
C) Shaky - you enforce some but cave under pressure (3 points)
D) Strong - you communicate and maintain them (4 points)
E) Unshakable - you protect your energy fiercely (5 points)




Question 18: "When someone asks for your time or energy:"
A) You immediately say yes even if it drains you (1 point)
B) You want to say no but feel too guilty (2 points)
C) You say yes then resent them later (3 points)
D) You check in with yourself before responding (4 points)
E) You honor your truth without guilt or explanation (5 points)




Question 19: "How you treat your body reflects:"
A) Neglect - ignoring signals and needs (1 point)
B) Punishment - harsh self-criticism (2 points)
C) Inconsistency - caring for it only sometimes (3 points)
D) Respect - honoring what it needs (4 points)
E) Reverence - treating it as sacred (5 points)




Question 20: "Your self-talk sounds like:"
A) Harsh criticism and constant judgment (1 point)
B) Disappointment and frustration with yourself (2 points)
C) Conditional - kind only when you "earn" it (3 points)
D) Encouraging - like a supportive friend (4 points)
E) Loving - like someone who adores you completely (5 points)




CATEGORY 5: ACTION & MANIFESTATION




Question 21: "When you set goals, you typically:"
A) Don't set them because you expect to fail (1 point)
B) Set them but abandon them when it gets hard (2 points)
C) Set them but need constant external motivation (3 points)
D) Set them and take consistent action toward them (4 points)
E) Set them and watch them manifest with flow (5 points)




Question 22: "Your relationship with taking action is:"
A) Paralyzed by fear or procrastination (1 point)
B) Waiting for the "perfect" moment that never comes (2 points)
C) Taking action but second-guessing every step (3 points)
D) Moving forward with clarity and confidence (4 points)
E) Taking bold, aligned action that creates results (5 points)




Question 23: "When opportunities arise:"
A) You assume there's a catch or it's too good to be true (1 point)
B) You feel unworthy and let others take them instead (2 points)
C) You consider them but talk yourself out of most (3 points)
D) You evaluate them clearly and choose what aligns (4 points)
E) You trust that perfect opportunities flow to you easily (5 points)




Question 24: "Your energy around your goals is:"
A) Defeated before you start (1 point)
B) Hopeful but realistic about limitations (2 points)
C) Motivated but inconsistent in action (3 points)
D) Determined and taking consistent steps (4 points)
E) Magnetic and naturally manifesting outcomes (5 points)




Question 25: "Overall, you believe:"
A) Life is hard and good things don't happen to people like me (1 point)
B) I have to work twice as hard as others to get half as much (2 points)
C) I deserve good things but they require sacrifice and struggle (3 points)
D) I am worthy of love, success, and abundance (4 points)
E) I am a powerful creator who effortlessly attracts my desires (5 points)




SCORING SYSTEM:
- Calculate total score (25-125 points)
- Convert to percentage: (score ÷ 125) × 100
- Assign one of 5 thermostat types based on score




5 THERMOSTAT TYPES:




Type 1: THE SETTLER (25-45 points / 20-36%)
Temperature: 55-65° (Crumbs)
Description: "I'll take the crumbs because I don't believe I deserve the feast"
Full description: Your worth thermostat is currently set very low. You've been conditioned to accept crumbs when you deserve celebration. You likely struggle with chronic underearning, toxic relationships, poor boundaries, and settling for far less than you're worth.
What you need: Deep emotional surgery, complete thermostat recalibration, recognition deficit healing
Next steps: 12-Week Transformation Program, 2-Hour Breakthrough Session




Type 2: THE SEEKER (46-65 points / 37-52%)
Temperature: 65-68° (Not Quite Enough)
Description: "I'm searching for my worth but keep looking outside myself"
Full description: Your worth thermostat is set below what you deserve, but you're aware something needs to change. You're searching for validation outside yourself and struggle to fully claim your worth.
What you need: Recognition deficit healing, Deep Love Question framework, boundary-setting skills
Next steps: Permission Granted Workshop, Boundary-setting content




Type 3: THE BOUNDARY BUILDER (66-85 points / 53-68%)
Temperature: 68-70° (Getting Warmer)
Description: "I'm learning to set boundaries but still struggle with guilt"
Full description: Your worth thermostat is improving! You're learning to set boundaries and honor your needs, but you still struggle with guilt and inconsistency. You know your worth intellectually but embodying it fully is still a work in progress.
What you need: Reinforcement of boundary-setting, tools to eliminate guilt, community support
Next steps: Permission Granted Workshop, Community membership




Type 4: THE RISING QUEEN (86-105 points / 69-84%)
Temperature: 70-72° (Celebration)
Description: "I know my worth and I'm stepping into my power"
Full description: Your worth thermostat is set to celebration! You know your worth, set strong boundaries, and attract relationships and opportunities that honor you. You still have moments of doubt, but they're becoming less frequent.
What you need: Expansion beyond current ceiling, next-level tools, community of high-worth individuals
Next steps: Advanced coaching, Leadership opportunities, Mastermind




Type 5: THE UNAPOLOGETIC (106-125 points / 85-100%)
Temperature: 72°+ (Full Celebration)
Description: "I demand celebration and accept nothing less than I deserve"
Full description: Your worth thermostat is set to FULL celebration! You demand what you deserve and accept nothing less. You know your worth, honor your boundaries, and create a life that reflects your value.
What you need: Opportunities to teach and share transformation, certification program, leadership platform
Next steps: Certification program, Teaching opportunities, Mastermind




RESULTS PAGE:
Display:
- Total score (X/125)
- Percentage (X%)
- Thermostat type name and icon
- Temperature setting graphic
- Full description
- What this means
- What you need
- Personalized next steps
- CTA buttons for recommended programs
- Option to download PDF report
- Option to save to profile (if logged in)
- Option to share results (social media)




EMAIL CAPTURE:
Before showing results, capture:
- First name
- Email address
Store in leads table, send automated email with full report




DATABASE TABLES (add to Supabase):




assessment_questions:
- id (uuid)
- question_number (integer, 1-25)
- category (text)
- question_text (text)
- option_a_text (text)
- option_a_points (integer, 1)
- option_b_text (text)
- option_b_points (integer, 2)
- option_c_text (text)
- option_c_points (integer, 3)
- option_d_text (text)
- option_d_points (integer, 4)
- option_e_text (text)
- option_e_points (integer, 5)




assessment_results:
- id (uuid)
- user_id (uuid, nullable, foreign key to users)
- email (text, for non-logged-in users)
- first_name (text)
- total_score (integer, 25-125)
- percentage_score (integer, 20-100)
- thermostat_type (text)
- category_scores (jsonb: {love: 12, money: 18, career: 15, boundaries: 14, action: 16})
- completed_at (timestamp)




thermostat_types:
- id (uuid)
- type_name (text)
- score_min (integer)
- score_max (integer)
- temperature_setting (text)
- description_short (text)
- description_full (text)
- what_this_means (text)
- what_you_need (text)
- next_steps (text)




Build the complete assessment with auto-scoring, database storage, email capture, and personalized results.
```




---




## 💬 LOVABLE PROMPT 3: ORACLE CARD SYSTEM




**After assessment is complete, add oracle cards:**




```
Add an Oracle Card system with 2 decks (104 total cards) and multiple reading types.




DECKS:
1. Permission Granted Deck (52 cards) - Available to all tiers
2. Abundance Deck (52 cards) - Available to Tier 2 and 3 only




CARD STRUCTURE:
Each card has:
- Card number (1-52 per deck)
- Deck name
- Card title (front of card)
- Message (front of card - short)
- Guidebook text (full teaching)
- Deep Love Question (reflection prompt)
- Affirmation
- Integration prompt (action step)
- Category (Permission to Release, Claim, Feel, Rise, Love, Integration)
- Related meditation (link to meditation library)




READING TYPES:
Create 6 different card pull/spread options:




1. SINGLE CARD PULL - "Daily Guidance"
   - Random single card
   - Display full card content
   - Option to journal about it
   - Option to set as daily intention




2. THREE-CARD SPREAD - "Past, Present, Future"
   - Position 1: Past (what got you here)
   - Position 2: Present (where you are now)
   - Position 3: Future (where you're heading)
   - Display all 3 cards with position meanings




3. RELATIONSHIP SPREAD - "Self, Other, Dynamic"
   - Position 1: You in this relationship
   - Position 2: The other person
   - Position 3: The relationship dynamic
   - Specific to relationship questions




4. CAREER/MONEY SPREAD - "Block, Path, Outcome"
   - Position 1: What's blocking you
   - Position 2: The path forward
   - Position 3: Potential outcome
   - For career/financial questions




5. WEEKLY SPREAD - "7-Day Forecast"
   - 7 cards, one for each day (Monday-Sunday)
   - Display as calendar layout
   - Option to save and revisit each day




6. YES/NO READING - "Clear Answer"
   - Single card
   - Interpret as "Yes" (cards 1-26) or "No" (cards 27-52)
   - Include guidance regardless of yes/no




CARD PULL INTERFACE:
- Beautiful card back design (purple with gold accents)
- Flip animation when card is revealed
- Option to pull another card
- Option to save reading to profile
- Share reading to social media
- Journal prompt based on cards pulled




PERMISSION GRANTED DECK (52 cards):
I'll provide all 52 cards in next prompt - Categories:
- Permission to Release (Cards 1-10)
- Permission to Claim (Cards 11-20)
- Permission to Feel (Cards 21-28)
- Permission to Rise (Cards 29-36)
- Permission to Love (Cards 37-44)
- Integration (Cards 45-52)




ABUNDANCE DECK (52 cards):
I'll provide all 52 cards in next prompt - Categories:
- Abundance Mindset (Cards 1-13)
- Money Manifestation (Cards 14-26)
- Receiving (Cards 27-39)
- Wealth Wisdom (Cards 40-52)




DATABASE TABLES (add to Supabase):




oracle_cards:
- id (uuid)
- deck_name (text: "Permission Granted" or "Abundance")
- card_number (integer, 1-52)
- category (text)
- title (text)
- message (text - short, for card front)
- guidebook_text (text - full teaching)
- deep_love_question (text)
- affirmation (text)
- integration_prompt (text)
- related_meditation_id (uuid, foreign key to meditations)
- image_url (text, for card images)




card_pulls:
- id (uuid)
- user_id (uuid, foreign key to users)
- reading_type (text: "single", "three-card", "relationship", etc.)
- cards_pulled (jsonb: array of card_ids with positions)
- question_asked (text, optional)
- journal_entry (text, optional)
- created_at (timestamp)




SUBSCRIPTION GATING:
- Tier 1: Permission Granted deck only
- Tier 2 & 3: Both decks
- Show upgrade prompt if Tier 1 user tries to access Abundance deck




Build the oracle card system with all reading types, beautiful card animations, and subscription tier gating.
```




---




## 💬 LOVABLE PROMPT 4: MEDITATION LIBRARY




**After oracle cards, add meditation system:**




```
Add a Meditation Library with 34 guided meditations organized into 3 categories, integrated with Minddist.




MEDITATION CATEGORIES:
1. Mind Meditations (10 total) - Focus, clarity, mental peace
2. Soul Meditations (12 total) - Purpose, spiritual connection, alignment
3. Body Meditations (12 total) - Healing, grounding, somatic release




MEDITATION STRUCTURE:
Each meditation has:
- Title
- Category (Mind, Soul, or Body)
- Duration (5-20 minutes)
- Description (what it does)
- Audio URL (hosted on Minddist)
- Thumbnail image
- Related oracle card
- Points awarded for completion (10 points each)




MEDITATION PLAYER:
Create audio player with:
- Play/pause button
- Progress bar
- Time elapsed / total time
- Volume control
- Playback speed (1x, 1.25x, 1.5x)
- Download option (Tier 2 & 3 only)
- Auto-advance to next meditation (optional)




MEDITATION LIBRARY PAGE:
- Tab navigation: Mind / Soul / Body
- Grid display of meditation thumbnails
- Search/filter functionality
- Favorites system (save meditations)
- Recently played section
- Recommended meditations (based on assessment results)




PROGRESS TRACKING:
- Mark meditation as complete when played to end
- Award 10 points per meditation
- Track total meditation minutes
- Create streak for daily meditation practice
- Display "meditation minutes this week/month"




MINDDIST INTEGRATION:
Each meditation links to audio file on Minddist:
- Use embed player for seamless playback
- Track completion via player events
- Cache recently played for offline access (future feature)




SUBSCRIPTION GATING:
- Tier 1: 10 Mind meditations only
- Tier 2: All 34 meditations
- Tier 3: All 34 meditations + download capability




MEDITATION LIST:




MIND MEDITATIONS (10):
1. "Morning Worth Reset" (7 min) - Start your day from worth, not wounding
2. "Decision Clarity Scan" (10 min) - Clear mental fog to make aligned choices
3. "Overthinking Release" (8 min) - Let go of mental loops and rumination
4. "Confidence Activation" (12 min) - Activate your inner certainty
5. "Fear of Judgment Release" (10 min) - Free yourself from others' opinions
6. "Mental Boundary Setting" (9 min) - Protect your mental energy
7. "Focus and Flow State" (15 min) - Enter deep concentration
8. "Anxiety Soothing" (8 min) - Calm nervous system activation
9. "Evening Mind Clear" (10 min) - Release the day's mental clutter
10. "Worth Affirmation Integration" (7 min) - Install new worth beliefs




SOUL MEDITATIONS (12):
1. "Purpose Alignment Check-In" (12 min) - Connect with your calling
2. "Divine Guidance Reception" (15 min) - Open to spiritual wisdom
3. "Soul Contract Release" (10 min) - Free yourself from old agreements
4. "Heart Center Opening" (14 min) - Expand capacity for love
5. "Ancestral Healing" (18 min) - Heal generational patterns
6. "Soul-Level Permission" (11 min) - Grant yourself spiritual freedom
7. "Intuition Activation" (13 min) - Strengthen your inner knowing
8. "Spiritual Recalibration" (16 min) - Align with highest self
9. "Sacred Worthiness" (12 min) - Know yourself as divine
10. "Life Purpose Clarity" (17 min) - Discover your soul's mission
11. "Energy Cord Cutting" (14 min) - Release draining attachments
12. "Soul Celebration" (10 min) - Honor your spiritual journey




BODY MEDITATIONS (12):
1. "Body Scan for Worth" (15 min) - Notice where you hold unworthiness
2. "Somatic Stress Release" (12 min) - Release tension from body
3. "Healing Waters Visualization" (14 min) - Cleanse and renew
4. "Root Chakra Grounding" (11 min) - Feel safe and supported
5. "Sacred Body Appreciation" (13 min) - Honor your physical form
6. "Pain Relief and Comfort" (16 min) - Soothe physical discomfort
7. "Energy Body Cleansing" (14 min) - Clear energetic residue
8. "Sleep Preparation" (20 min) - Deep relaxation for rest
9. "Trauma Release (Gentle)" (18 min) - Safe somatic processing
10. "Vitality Restoration" (12 min) - Restore physical energy
11. "Self-Touch Love Practice" (10 min) - Loving presence with body
12. "Body Boundary Reinforcement" (13 min) - Physical space protection




DATABASE TABLES (add to Supabase):




meditations:
- id (uuid)
- title (text)
- category (text: "Mind", "Soul", or "Body")
- duration_minutes (integer)
- description (text)
- audio_url (text - Minddist embed URL)
- thumbnail_url (text)
- related_card_id (uuid, foreign key to oracle_cards)
- points_value (integer, default: 10)
- tier_required (integer: 1, 2, or 3)




meditation_completions:
- id (uuid)
- user_id (uuid, foreign key to users)
- meditation_id (uuid, foreign key to meditations)
- completed_at (timestamp)
- minutes_listened (integer)
- points_awarded (integer)




favorites:
- id (uuid)
- user_id (uuid, foreign key to users)
- meditation_id (uuid, foreign key to meditations)
- added_at (timestamp)




Build the complete meditation library with Minddist integration, progress tracking, and subscription tier gating.
```




---




## 💬 LOVABLE PROMPT 5: DIGITAL WORKBOOK




**After meditations, add the 30-page interactive workbook:**




```
Add a 30-page interactive digital workbook called "Permission Granted Workbook."




WORKBOOK STRUCTURE:
30 pages organized into sections:
- Pages 1-5: Foundation (Introduction, Assessment Review, Recognition Deficit)
- Pages 6-12: Crumbs Inventory (Identifying patterns)
- Pages 13-18: Deep Love Question Framework
- Pages 19-25: Weekly Permission Practices
- Pages 26-30: Integration & Future




Each page includes:
- Page title
- Teaching content (text)
- Interactive form fields (text inputs, checkboxes, text areas)
- Related meditation
- Related oracle card
- Auto-save functionality
- Points awarded (15 points per completed page)




WORKBOOK FEATURES:
- Progress tracking ("Page 5 of 30 Complete - 17%")
- Auto-save every 30 seconds
- "My Workbook" dashboard showing completed/in-progress pages
- Can't skip ahead - must complete pages in order
- Print/download individual pages as PDF
- Export entire workbook as PDF when complete




PAGE-BY-PAGE CONTENT:




PAGE 1: Welcome to Permission Granted
- Introduction to the workbook
- How to use this resource
- Commitment statement (checkbox to agree)
- Points: 15




PAGE 2: Your Assessment Results
- Display their Thermostat Type
- Their total score
- Category breakdown
- Reflection: "What surprised you most?"
- Points: 15




PAGE 3: Understanding Recognition Deficit
- Teaching on Recognition Deficit
- Self-assessment: "Where do I have recognition deficit?"
- List 5 areas where you accept crumbs
- Points: 15




PAGE 4: Your Crumbs Inventory - Relationships
- Identify 3 relationship crumbs patterns
- For each: What's the crumb? What would celebration look like?
- Points: 15




PAGE 5: Your Crumbs Inventory - Money
- Identify 3 money crumbs patterns
- Current money story vs. desired money story
- Points: 15




PAGE 6: Your Crumbs Inventory - Career
- Identify 3 career/purpose crumbs
- Where are you hiding? Where are you undervaluing yourself?
- Points: 15




PAGE 7: Your Crumbs Inventory - Boundaries
- Identify 3 boundary crumbs
- Who/what drains your energy? Where do you say yes when you mean no?
- Points: 15




PAGE 8: Your Crumbs Inventory - Self-Care
- How you neglect yourself
- Self-talk patterns
- Body treatment
- Points: 15




PAGE 9: Where Your Thermostat Got Set
- Earliest memory of accepting crumbs
- Who taught you to settle?
- What were you told about your worth?
- Points: 15




PAGE 10: The Cost of Settling
- What has accepting crumbs cost you?
- Relationships lost, opportunities missed, parts of yourself abandoned
- Points: 15




PAGE 11: The Deep Love Question - Introduction
- Teaching: "How would someone who deeply loved me respond?"
- Why this question changes everything
- Practice with simple example
- Points: 15




PAGE 12: Deep Love Question - Work Scenarios
- 5 work scenarios
- For each: What's the crumbs response? What's the Deep Love response?
- Points: 15




PAGE 13: Deep Love Question - Relationship Scenarios
- 5 relationship scenarios
- Crumbs vs. Deep Love responses
- Points: 15




PAGE 14: Deep Love Question - Self Scenarios
- 5 self-care scenarios
- Practice choosing Deep Love response
- Points: 15




PAGE 15: Your Personal Situations
- 3 real situations you're facing now
- Apply Deep Love Question to each
- Action steps
- Points: 15




PAGE 16: Integrating The Question
- Daily practice plan
- How to remember to ask the question
- Accountability system
- Points: 15




PAGE 17: Week 1 Permission Practice - Rest Without Earning It
- Daily prompts for Week 1
- How to rest without guilt
- Track your practice
- Points: 15




PAGE 18: Week 1 Daily Journal Prompts
- 7 daily journal prompts for rest practice
- Reflection space
- Points: 15




PAGE 19: Week 2 Permission Practice - Say No Without Explanation
- Daily prompts for Week 2
- Practice saying no
- Track boundaries set
- Points: 15




PAGE 20: Week 2 Daily Journal Prompts
- 7 daily prompts for boundary practice
- Points: 15




PAGE 21: Week 3 Permission Practice - Want More Without Guilt
- Daily prompts for Week 3
- Practice desiring without shame
- Track desires acknowledged
- Points: 15




PAGE 22: Week 3 Daily Journal Prompts
- 7 daily prompts for desire practice
- Points: 15




PAGE 23: Week 4 Permission Practice - Choose Yourself First
- Daily prompts for Week 4
- Practice self-prioritization
- Track moments you chose yourself
- Points: 15




PAGE 24: Week 4 Daily Journal Prompts
- 7 daily prompts for self-choice practice
- Points: 15




PAGE 25: Your Custom Permission
- Create your own 5th week practice
- What permission do YOU most need?
- Design your daily practice
- Points: 15




PAGE 26: Your 30-Day Integration Plan
- Bring it all together
- Daily, weekly, monthly practices
- How to maintain your new thermostat
- Points: 15




PAGE 27: Maintenance - Keeping Your Thermostat High
- Warning signs of slipping back to crumbs
- Recovery protocol when you slip
- Ongoing practices
- Points: 15




PAGE 28: Before & After - Track Your Transformation
- Where you started (from assessment)
- Where you are now (re-take mini assessment)
- Observable changes
- Points: 15




PAGE 29: Your Wins & Evidence
- List 10 ways you've chosen celebration over crumbs
- Celebrate your transformation
- Evidence you're becoming
- Points: 15




PAGE 30: You Did It - What's Next
- Completion celebration
- Next steps in your journey
- Resources and support
- Final commitment
- Points: 15




SUBSCRIPTION GATING:
- Tier 1: Pages 1-10 only
- Tier 2 & 3: All 30 pages




DATABASE TABLES (add to Supabase):




workbook_pages:
- id (uuid)
- page_number (integer, 1-30)
- title (text)
- content (text - teaching/prompts)
- form_fields (jsonb - array of field definitions)
- related_meditation_id (uuid)
- related_card_id (uuid)
- points_value (integer, default: 15)
- tier_required (integer: 1, 2, or 3)




workbook_responses:
- id (uuid)
- user_id (uuid, foreign key to users)
- page_id (uuid, foreign key to workbook_pages)
- responses (jsonb - user's form field answers)
- completed (boolean)
- completed_at (timestamp)
- points_awarded (integer)
- last_saved (timestamp)




Build the complete 30-page workbook with auto-save, progress tracking, PDF export, and subscription tier gating.
```




---




## 💬 LOVABLE PROMPT 6: PROGRESS & GAMIFICATION




**Add progress tracking and streak system:**




```
Add progress tracking, streaks, and gamification features.




DASHBOARD PAGE:
Create a user dashboard showing:
- Current streak (days)
- Total points earned
- Progress bars for each category:
  - Assessment: Complete/Incomplete
  - Meditations: X/34 completed
  - Workbook: X/30 pages complete
  - Oracle Cards: X total pulls
- This week's activity
- Recommended next steps based on progress




STREAK SYSTEM:
- Track consecutive days of engagement
- "Engagement" = completing any of: meditation, workbook page, oracle card pull
- Display current streak prominently
- Show longest streak achieved
- Celebrate milestones (7 days, 30 days, 90 days, 365 days)
- Send email if streak is about to break (24 hours inactive)




POINTS SYSTEM:
Earn points for:
- Completing assessment: 50 points
- Each meditation completed: 10 points
- Each workbook page completed: 15 points
- Each oracle card pull: 5 points
- Daily login: 2 points
- Maintaining 7-day streak: 50 bonus points
- Maintaining 30-day streak: 150 bonus points




Points unlock:
- Badges and achievements
- Special content (at certain point thresholds)
- Leaderboard position (optional, can opt out)




ACHIEVEMENTS/BADGES:
Create badges for:
- "First Step" - Complete assessment
- "Daily Devotion" - 7-day streak
- "Meditation Master" - Complete all 34 meditations
- "Workbook Warrior" - Complete all 30 pages
- "Card Reader" - Pull 100 oracle cards
- "The Committed" - 30-day streak
- "The Dedicated" - 90-day streak
- "The Transformed" - 365-day streak




NOTIFICATIONS:
Send notifications (in-app and email) for:
- Streak milestones
- New achievements unlocked
- Recommended next step based on inactivity
- Weekly progress summary
- Monthly transformation report




DATABASE TABLES (add to Supabase):




user_progress:
- id (uuid)
- user_id (uuid, foreign key to users)
- assessment_complete (boolean)
- meditations_completed (integer)
- workbook_pages_completed (integer)
- total_card_pulls (integer)
- current_streak_days (integer)
- longest_streak_days (integer)
- last_activity_date (date)
- total_points (integer)
- updated_at (timestamp)




achievements:
- id (uuid)
- badge_name (text)
- description (text)
- icon_url (text)
- points_required (integer, nullable)
- streak_required (integer, nullable)
- condition_type (text: "assessment", "streak", "points", etc.)




user_achievements:
- id (uuid)
- user_id (uuid, foreign key to users)
- achievement_id (uuid, foreign key to achievements)
- unlocked_at (timestamp)




daily_activity:
- id (uuid)
- user_id (uuid, foreign key to users)
- activity_date (date)
- meditations_count (integer)
- workbook_pages_count (integer)
- card_pulls_count (integer)
- points_earned (integer)




Build complete progress tracking, streaks, points, achievements, and notifications system.
```




---




## 💬 LOVABLE PROMPT 7: SUBSCRIPTION & PAYMENTS




**Integrate Stripe for payments:**




```
Integrate Stripe for subscription payments and tier management.




STRIPE SETUP:
- Connect to Stripe account
- Create 3 subscription products in Stripe
- Handle webhook events for subscription changes
- Manage subscription status in database




3 SUBSCRIPTION PRODUCTS:




Product 1: "Permission Granted - Mind"
- Price: $33/month
- Stripe Price ID: (you'll add this)
- Features unlocked: Tier 1 access




Product 2: "Complete Transformation"
- Price: $55/month
- Stripe Price ID: (you'll add this)
- Features unlocked: Tier 2 access




Product 3: "VIP Total Reset"
- Price: $111/month
- Stripe Price ID: (you'll add this)
- Features unlocked: Tier 3 access




SUBSCRIPTION FLOW:
1. User clicks "Upgrade" or "Subscribe" button
2. Show pricing comparison page
3. User selects tier
4. Redirect to Stripe Checkout
5. After successful payment, redirect back to app
6. Update user's subscription_tier in database
7. Unlock appropriate features
8. Send welcome email with access details




SUBSCRIPTION MANAGEMENT PAGE:
Allow users to:
- View current subscription tier
- See what features are included
- Upgrade to higher tier
- Downgrade to lower tier (at next billing cycle)
- Cancel subscription
- Update payment method
- View billing history
- Download invoices




STRIPE WEBHOOKS:
Handle these Stripe events:
- checkout.session.completed (new subscription)
- customer.subscription.updated (tier change)
- customer.subscription.deleted (cancellation)
- invoice.payment_succeeded (successful payment)
- invoice.payment_failed (failed payment)




When payment fails:
- Send email notification
- Grace period of 3 days
- After 3 days, downgrade to free tier
- Save their progress/data




FREE TIER:
Users can use app for free with limited access:
- Take assessment (one time)
- Access first 5 meditations
- Access Permission Granted deck only
- Access workbook pages 1-10
- No download capabilities
- Ads or upgrade prompts in appropriate places




UPGRADE PROMPTS:
Show contextual upgrade prompts when free users try to:
- Access Tier 2/3 meditations
- Download content
- Access Abundance deck
- View workbook pages 11-30




Make prompts helpful, not annoying:
- "Unlock all 34 meditations with Complete Transformation - $55/month"
- Show what they're missing
- One-click upgrade flow




DATABASE (update users table):
- subscription_tier (text: "free", "tier1", "tier2", "tier3")
- stripe_customer_id (text)
- stripe_subscription_id (text)
- subscription_status (text: "active", "canceled", "past_due")
- current_period_end (timestamp)




Build complete Stripe integration with subscription management, webhooks, and tier-based feature gating.
```




---




## 💬 LOVABLE PROMPT 8: HUMAN DESIGN INTEGRATION




**Add Human Design personalization:**




```
Add Human Design integration for personalized recommendations.




HUMAN DESIGN TYPES:
1. Manifestor
2. Generator
3. Manifesting Generator
4. Projector
5. Reflector




USER ONBOARDING:
After signup, ask:
"What's your Human Design type?"
- Dropdown with 5 types
- "Not sure? Take this 2-minute quiz" (link to external quiz)
- Skip option (can add later in profile)




PERSONALIZED CONTENT:
Based on Human Design type, customize:
- Recommended meditations
- Oracle card interpretations
- Workbook prompts
- Daily practices




For example:
- Manifestors: Focus on initiation, informing, anger release
- Generators: Focus on sacral response, satisfaction, frustration release
- MGs: Focus on multi-passionate expression, patience, efficiency
- Projectors: Focus on waiting for invitation, recognition, rest
- Reflectors: Focus on lunar cycle, community, patience




HUMAN DESIGN REPORTS:
Create personalized report for each type showing:
- Your worth thermostat patterns (based on type)
- Common crumbs for your type
- How your type tends to settle
- Strategies for your type to choose celebration
- Meditations specifically for your type
- Oracle cards that resonate with your type




DATABASE (add table):




human_design_content:
- id (uuid)
- design_type (text: type name)
- content_type (text: "meditation_rec", "oracle_interpretation", etc.)
- content_id (uuid: foreign key to relevant content)
- personalized_text (text: customized description)
- priority (integer: for sorting recommendations)




Build Human Design integration with personalized recommendations and type-specific content.
```




---




## 🎨 LOVABLE PROMPT 9: DESIGN & BRANDING




**Polish the design:**




```
Refine the app design to match "The Emotional Surgeon" brand.




BRAND COLORS:
- Primary: #7C3AED (Purple - worth, transformation)
- Secondary: #F59E0B (Gold - celebration, abundance)
- Accent: #EC4899 (Pink - love, healing)
- Neutral: #1F2937 (Dark gray for text)
- Background: #F9FAFB (Light gray)




DESIGN AESTHETIC:
- Spa-like, calming, luxurious
- Modern minimalism
- Glassmorphism effects on cards
- Soft shadows and rounded corners
- Smooth animations and transitions
- Purple gradient overlays
- Gold accents for premium features




TYPOGRAPHY:
- Headings: Playfair Display or Cormorant (elegant serif)
- Body: Inter or Source Sans Pro (clean sans-serif)
- Size hierarchy: Clear differentiation




COMPONENTS TO STYLE:




BUTTONS:
- Primary: Purple with gold hover
- Secondary: Gold with purple hover
- Disabled: Gray
- Loading states with spinner




CARDS:
- White background
- Subtle purple border
- Hover: Lift with shadow
- Glass effect for oracle cards




FORMS:
- Clean input fields
- Purple focus states
- Helpful error messages
- Success states in gold




NAVIGATION:
- Fixed top nav on scroll
- Mobile: Slide-in menu
- Active state: Gold underline




ORACLE CARDS:
- Card back: Purple with mandala pattern
- Card front: White with gold border
- Flip animation: Smooth 3D effect
- Glow effect when hovering




ASSESSMENT:
- Progress bar: Purple gradient
- Question cards: Elevated white cards
- Results: Celebration animation when revealed




DASHBOARD:
- Widget cards: Glass effect
- Charts: Purple/gold color scheme
- Streak: Fire emoji with purple glow
- Points: Gold coin icon




ACCESSIBILITY:
- WCAG AA compliant
- Keyboard navigation
- Screen reader friendly
- Color contrast ratios checked
- Alt text on all images




RESPONSIVE DESIGN:
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Touch-friendly buttons (min 44px)
- Readable text on all devices




Apply this design system across the entire app for a cohesive, premium experience.
```




---




## 📱 FINAL STEPS: DEPLOYMENT & LAUNCH




### STEP 1: Testing Phase
- Test all features on mobile and desktop
- Test subscription flows with Stripe test mode
- Get 5-10 beta users to test
- Fix bugs and refine UX




### STEP 2: Content Upload
- Upload all oracle card content to database
- Add meditation URLs from Minddist
- Populate workbook pages
- Add images for cards and meditations




### STEP 3: Stripe Production Mode
- Create live products in Stripe
- Update Stripe keys to production
- Test payment flow with real card




### STEP 4: Custom Domain
- Purchase domain (resetyourmind1111.com or app.resetyourmind1111.com)
- Connect to Lovable hosting
- Set up SSL certificate




### STEP 5: Launch!
- Send email to your list
- Post on social media
- Offer launch special (first 50 users get 50% off first month)
- Monitor for issues




---




## 💰 ESTIMATED COSTS:




**Monthly:**
- Lovable Pro: $20/month
- Supabase: $0-25/month (depends on usage)
- Stripe: 2.9% + 30¢ per transaction
- Domain: ~$1/month (annual)
- **Total: $21-46/month**




**Break-Even:**
- Need 1-2 paying subscribers to cover costs
- Everything after that is profit!




---




## 🚀 REVENUE PROJECTIONS:




**Conservative (Month 3):**
- 10 Tier 1 subscribers × $33 = $330
- 5 Tier 2 subscribers × $55 = $275
- 2 Tier 3 subscribers × $111 = $222
- **Total: $827/month**




**Moderate (Month 6):**
- 30 Tier 1 × $33 = $990
- 20 Tier 2 × $55 = $1,100
- 10 Tier 3 × $111 = $1,110
- **Total: $3,200/month**




**Ambitious (Month 12):**
- 100 Tier 1 × $33 = $3,300
- 75 Tier 2 × $55 = $4,125
- 25 Tier 3 × $111 = $2,775
- **Total: $10,200/month**




---




## ✅ YOU'RE READY TO BUILD!




You now have:
✅ Complete Lovable.dev build guide (9 detailed prompts)
✅ All content ready (assessment, cards, meditations, workbook)
✅ Database structure defined
✅ Subscription tiers and pricing set
✅ Design system specified
✅ Launch plan outlined




**Next step: Go to lovable.dev, start a new project, and paste in PROMPT 1!**




---




**© 2026 Lorie Wu | The Emotional Surgeon | Reset Your Mind 1111™**




**Let's build your empire!** 💜✨🚀

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://resetyourmind1111.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e0c3104e-89de-46cb-978e-ccf1844a67a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
