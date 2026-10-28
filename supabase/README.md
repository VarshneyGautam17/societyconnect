# Supabase setup

Run once, in order, in the Supabase dashboard's **SQL Editor** (New query -> paste -> Run):

1. `schema.sql` -- tables, RLS policies, the approval-workflow trigger.
2. `seed.sql` -- optional, the 20 sample businesses so the directory isn't empty on day one.

## Making yourself an admin

There's deliberately no "sign up as admin" flow -- admin access is only ever granted by hand,
from the SQL Editor (which runs as the Postgres owner and bypasses RLS, so this works even
though the `admins` table has no public insert policy at all).

1. Sign in to the app once through the normal vendor auth flow (email) so a row exists in
   `auth.users` for your email.
2. In the SQL Editor:

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

3. You can now sign in at `/admin`.

To remove an admin, `delete from admins where user_id = (select id from auth.users where email = '...');`.
