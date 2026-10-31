# Supabase setup

Run `schema.sql` once in the Supabase dashboard's **SQL Editor** (New query -> paste -> Run):
tables, RLS policies, the approval-workflow trigger. There is no seed data -- every table
starts empty and fills with real vendors, societies and residents.

## Admin sign-in

`/admin/login` takes an email and password, checked on the server by Supabase Auth
(src/app/admin/login/actions.js) -- the password is stored only in Supabase, hashed. A correct
password isn't enough on its own: the account must also be in the `admins` table, otherwise
the session is dropped. There's deliberately no "sign up as admin" flow.

### Adding an admin

1. Supabase dashboard -> **Authentication -> Users -> Add user -> Create new user**: enter the
   email and password, tick **Auto Confirm User**.
2. In the SQL Editor:

   ```sql
   insert into admins (user_id)
   select id from auth.users where email = 'admin@example.com';
   ```

### Changing an admin's password

Authentication -> Users -> click the user -> **Reset password** (emails a link), or ask the
developer to set it with the service-role key.

### Removing an admin

`delete from admins where user_id = (select id from auth.users where email = '...');`
