-- Brand v2 theme alignment for existing PitchLock tenants.
-- Safe to re-run: updates flagship `parable-seed` to cinematic v2 tokens.

update public.pitchlock_projects
set
  theme_bg = '#000000',
  theme_panel = 'rgba(5, 8, 18, 0.72)',
  theme_border = 'rgba(0, 242, 255, 0.14)',
  theme_accent = '#00F2FF',
  theme_success = '#28F5A3',
  theme_text = 'rgba(255, 255, 255, 0.78)'
where slug = 'parable-seed';

notify pgrst, 'reload schema';
