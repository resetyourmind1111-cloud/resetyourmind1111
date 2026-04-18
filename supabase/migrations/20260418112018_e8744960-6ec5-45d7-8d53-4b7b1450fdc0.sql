UPDATE public.profiles 
SET trial_start_date = (now() - interval '5 days'),
    day6_gift_shown = false,
    day6_bonus_oracle_used = false,
    oracle_preview_pulls_used = 0
WHERE user_id = 'e47a8591-1f40-4878-8f9c-69a08ce5abd7';