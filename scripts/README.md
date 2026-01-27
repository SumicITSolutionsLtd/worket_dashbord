# Scripts

## Admin access and “who is admin?”

The dashboard treats a user as **platform admin** if:

- the API returns **`is_staff === true`** on the user (from login/me), or  
- the user’s email is in **`PLATFORM_ADMIN_EMAILS`** in `src/lib/auth.ts`.

The **Worket API does not currently expose `is_staff`** in login or `/auth/me/` responses. Until the backend adds it (or another “staff/role” field), the dashboard uses the email list: add known staff emails to `PLATFORM_ADMIN_EMAILS` (e.g. `['admin@worket.ug']`) so those users see the Admin Panel. The backend may use `is_staff`, a role, or user id internally; the dashboard only sees what the API returns.

### Why admin gets 403 on company/job detail (verify, feature)

The admin panel calls the **same** endpoints as employers:

- `GET /companies/:id/` – company detail (e.g. admin “View” or verify/feature page)
- `PATCH /companies/:id/` – verify/feature a company
- `GET /jobs/:id/` – job detail
- `PATCH /jobs/:id/` – active/feature a job

Right now the backend returns **403 Forbidden** when a **staff** user tries to access a company or job they don’t own. The Company/Job views are permissioned for **owner only**, so the admin account from the backend team is correct for admin-only endpoints (e.g. approve applications), but it cannot read or update other users’ companies/jobs.

**For the admin panel’s Verify/Feature/View to work, the backend must allow staff users to:**

- **GET** and **PATCH** any company at `/companies/:id/` (e.g. add an “if user.is_staff, allow” in the Company viewset permissions).
- **GET** and **PATCH** any job at `/jobs/:id/` (same for the Job viewset).

Until that change is made, admins will see 403 on company/job detail and on verify/feature. The admin account itself is fine; the restriction is in the Company/Job permission logic.

### Employer gets 403 on own dashboard/jobs

When a **logged-in employer** (e.g. `nhcc@worket.com` after seed) opens the employer dashboard or Jobs page, the app calls:

- `GET /employer/dashboard/stats/`
- `GET /employer/dashboard/top-jobs/`
- `GET /employer/dashboard/recent-applications/`
- `GET /employer/jobs/`

If the backend returns **403 Forbidden** for those requests, the employer sees “We couldn’t load your jobs” (or empty dashboard) even though jobs were seeded for their company. The frontend cannot fix this.

**Backend must:** Allow an approved employer who has a company to access those employer endpoints. Typical causes of 403 here:

- Employer permissions not fully granted when the application was approved (e.g. “job posting” or “employer dashboard” scope).
- Employer–company link or “active employer” flag not set or not checked by the employer views.

Until the backend allows that employer access, the dashboard will keep showing the error state. The Jobs page now shows a clear “We couldn’t load your jobs” message and suggests signing out and back in or contacting support.

## Seed showcase employers and jobs

`seed-showcase.js` creates the 3 showcase employers, their companies, and jobs on the live API so that **Featured Jobs** and **Featured Employers** show:

1. **National Housing and Construction Company** – construction, Kampala  
2. **Mwesigwa Resorts** – hospitality  
3. **Stanbic Bank Uganda Limited** – finance  

The script flow is:

1. Register each employer (if needed) and submit an employer application.
2. **Admin approves** those applications (script uses admin token for this – this is the only admin action the script needs).
3. Create companies (or use existing) and create jobs **as each employer**. Job creation requires the backend to grant **job posting permissions**; the API has no admin endpoint to “add members” or “grant permissions” – that’s enforced inside the backend (e.g. when an application is approved). If you see “You must be a member of a company with job posting permissions”, the backend must grant that when it approves the application or via its own admin tools.
4. Mark companies and jobs as **featured** using **each employer’s token**. The API returns “You can only update your own company” when admin tries to PATCH a company, so the script does not use admin for featuring; it uses employer tokens.

### Run the seed script

**You must pass admin credentials** so the script can approve employer applications. Use a staff user (e.g. `admin@worket.ug` from the backend team).

**Windows (PowerShell or cmd)** — CLI args:

```powershell
npm run seed-showcase -- admin@worket.ug "WorketAdmin123!"
```

**Linux / macOS** — env or CLI args:

```bash
ADMIN_EMAIL=admin@worket.ug ADMIN_PASSWORD="..." npm run seed-showcase
node scripts/seed-showcase.js admin@worket.ug "YourPassword"
```

**Env (optional if you pass args):**

- `API_BASE_URL` – default `https://api.worketconnect.com/api/v1`
- `ADMIN_EMAIL` – staff user email
- `ADMIN_PASSWORD` – staff user password

Without admin credentials, the script only registers/logs in and submits employer applications, then instructs you to run again with admin to approve.

### What admin can and can’t do via the script / API

- **Admin does:** Approve employer applications. The script calls the admin-only approve endpoint with the admin token.
- **Admin does not (via this API):** “Add members” or “grant job posting permissions.” Those are enforced by the backend when an application is approved (or via backend admin tools). The public API has no endpoint for an admin to grant a user “job posting permission” on a company.
- **Company/job featured:** The API only allows the **company owner** to update that company (`PATCH /companies/:id/`). So the script sets featured using each employer’s token, not the admin token.

### Employer logins created by the script

The script prints employer logins at the end. Default emails/password:

| Company                              | Email              | Password      |
|-------------------------------------|--------------------|---------------|
| National Housing and Construction Co | nhcc@worket.com    | DemoSecure1!  |
| Mwesigwa Resorts                     | mwesigwa@worket.com| DemoSecure1!  |
| Stanbic Bank Uganda Limited          | stanbic@worket.com | DemoSecure1!  |

If an email already exists, the script skips registration and uses login only. Use these accounts to open the employer dashboard and demonstrate managing jobs and publishing to the app.

## curl examples (auth only)

Login:

```bash
curl -X POST 'https://api.worketconnect.com/api/v1/auth/login/' \
  -H 'Accept: application/json' -H 'Content-Type: application/json' \
  -d '{"email":"YOUR_ADMIN_EMAIL","password":"YOUR_PASSWORD"}'
```

Register employer:

```bash
curl -X POST 'https://api.worketconnect.com/api/v1/auth/register/' \
  -H 'Accept: application/json' -H 'Content-Type: application/json' \
  -d '{"email":"newemployer@example.com","first_name":"Demo","last_name":"User","password":"SecurePass1!","password_confirm":"SecurePass1!","is_employer":true,"is_job_seeker":false}'
```
