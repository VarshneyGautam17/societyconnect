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

## Phone verification (MSG91)

Enquiries on a real (non-demo) business require a verified phone number before they're
accepted -- see `src/app/business/actions.js`. This needs an MSG91 account:

1. Sign up at msg91.com.
2. Register as a DLT entity (MSG91's dashboard walks you through this) -- required by Indian
   telecom regulation for any OTP/transactional SMS, and can take 1-3 business days to approve.
   This is the slow part; start it early.
3. Register a Sender ID and an OTP template containing a `##OTP##` placeholder (e.g. "Your
   SocietyConnect verification code is ##OTP##. Valid for 5 minutes.") -- both need DLT approval
   too, usually faster than the entity registration.
4. From the dashboard, grab your **Auth Key** and the approved **Template ID** -> put them in
   `.env.local` as `MSG91_AUTH_KEY` and `MSG91_OTP_TEMPLATE_ID`.

Also needed for this flow: `SUPABASE_SERVICE_ROLE_KEY` (Project Settings -> API Keys ->
`service_role`/`secret` key) in `.env.local`. This key bypasses RLS -- it's only ever read
server-side (see `src/lib/supabase/serviceRole.js`), never sent to the browser.
