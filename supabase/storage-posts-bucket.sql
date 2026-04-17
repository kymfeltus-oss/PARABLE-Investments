-- Create a public `posts` bucket for sanctuary/Testify media (run in Supabase SQL editor if the bucket does not exist).
-- Dashboard: Storage → New bucket → name `posts` → Public bucket ✓

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts', 'posts', true, 26214400, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

-- Authenticated users can upload to their own folder (optional if you only use Edge + service role).
-- Service role used by Edge bypasses RLS.

create policy "posts public read"
on storage.objects for select
to public
using (bucket_id = 'posts');

create policy "posts authenticated insert own prefix"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "posts authenticated update own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "posts authenticated delete own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'posts'
  and (storage.foldername(name))[1] = auth.uid()::text
);
