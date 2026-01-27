/**
 * Seed the Worket API with the 3 showcase employers, their companies, and jobs.
 * Featured Jobs and Featured Employers on the app will show these three.
 *
 * Flow: register -> submit employer application -> admin approves -> create company -> create jobs.
 * Company/job "featured" is set using each employer's token (API restricts company updates to own company).
 *
 * Job creation requires the backend to grant "job posting permissions" when the employer application
 * is approved. If you see "You must be a member of a company with job posting permissions", the
 * backend may need to ensure approved employers get that permission on their company.
 *
 * Prerequisites:
 * - Node 18+ (for fetch)
 * - Live API at https://api.worketconnect.com/api/v1
 * - Admin credentials (env or CLI args; required to approve applications only)
 *
 * Usage:
 *   # Windows (CLI args)
 *   node scripts/seed-showcase.js admin@worket.ug "WorketAdmin123!"
 *
 *   # Linux/macOS (env)
 *   ADMIN_EMAIL=admin@worket.ug ADMIN_PASSWORD="..." node scripts/seed-showcase.js
 *
 * Env (optional if args provided):
 *   API_BASE_URL   defaults to https://api.worketconnect.com/api/v1
 *   ADMIN_EMAIL    admin user (is_staff) – used to approve employer applications
 *   ADMIN_PASSWORD admin password
 */

const BASE = process.env.API_BASE_URL || 'https://api.worketconnect.com/api/v1';

// Allow admin credentials from CLI: node seed-showcase.js <email> <password>
// On Windows, npm often splits "Your password can't" into separate args; treat everything after email as password.
if (process.argv[2]) {
  process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.argv[2];
  if (process.argv[3] !== undefined) {
    process.env.ADMIN_PASSWORD =
      process.env.ADMIN_PASSWORD || (process.argv.length > 4 ? process.argv.slice(3).join(' ') : process.argv[3]);
  }
}

const EMPLOYER_SHARED_PASSWORD = 'DemoSecure1!';

const SHOWCASE_EMPLOYERS = [
  {
    email: 'nhcc@worket.com',
    firstName: 'NHCC',
    lastName: 'Admin',
    companyName: 'National Housing and Construction Company',
    description: 'National Housing and Construction Company - Building Uganda\'s future.',
    location: 'Kampala, Uganda',
    industry: 'construction',
    district: 'Kampala',
    phone: '+256700000001',
    jobs: [
      { title: 'Senior Project Engineer', featured: true },
      { title: 'Senior Quantity Surveyor', featured: false },
      { title: 'Construction Managers (Buildings & Roads)', featured: false },
      { title: 'Manager Estates & Survey', featured: false },
    ],
  },
  {
    email: 'mwesigwa@worket.com',
    firstName: 'Mwesigwa',
    lastName: 'Resorts',
    companyName: 'Mwesigwa Resorts',
    description: 'Mwesigwa Resorts - Hospitality and leisure.',
    location: 'Uganda',
    industry: 'hospitality',
    district: 'Kampala',
    phone: '+256700000002',
    jobs: [
      { title: 'General Manager', featured: true },
      { title: 'House Keepers (5 slots)', featured: false },
      { title: 'Gym Instructor', featured: false },
      { title: 'Waitresses (4 slots)', featured: false },
      { title: 'Drivers (3)', featured: false },
      { title: 'Builders (2)', featured: false },
    ],
  },
  {
    email: 'stanbic@worket.com',
    firstName: 'Stanbic',
    lastName: 'Bank',
    companyName: 'Stanbic Bank Uganda Limited',
    description: 'Stanbic Bank Uganda Limited - Banking and financial services.',
    location: 'Kampala, Uganda',
    industry: 'finance',
    district: 'Kampala',
    phone: '+256700000003',
    jobs: [
      { title: 'Manager, Digital Adoption', featured: true },
      { title: 'Manager, Business – Stanbic Business Incubator', featured: false },
      { title: 'Stanbic Graduate Training Programme', featured: false },
    ],
  },
];

function unwrap(data) {
  if (data && typeof data === 'object' && 'status' in data && 'data' in data) {
    return data.data;
  }
  return data;
}

async function post(path, body, token = null) {
  const opts = {
    method: 'POST',
    headers: { Accept: 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body instanceof FormData) {
    opts.body = body;
  } else {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const r = await fetch(`${BASE}${path}`, opts);
  const text = await r.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${path} ${r.status}: ${text.slice(0, 200)}`);
  }
  if (!r.ok) throw new Error(json.detail || json.message || JSON.stringify(json));
  return json;
}

async function get(path, token) {
  const r = await fetch(`${BASE}${path}`, {
    headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json.detail || json.message || JSON.stringify(json) || `GET ${path} ${r.status}`);
  return json;
}

async function patch(path, body, token) {
  const isForm = body instanceof FormData;
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isForm ? body : JSON.stringify(body),
  });
  const json = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(json.detail || json.message || `PATCH ${path} ${r.status}`);
  return json;
}

async function register(email, firstName, lastName, password) {
  const data = unwrap(
    await post('/auth/register/', {
      email,
      first_name: firstName,
      last_name: lastName,
      password,
      password_confirm: password,
      is_employer: true,
      is_job_seeker: false,
    })
  );
  return data;
}

async function login(email, password) {
  const res = await post('/auth/login/', { email, password });
  const data = unwrap(res);
  return { user: data.user, access: data.tokens?.access || data.access };
}

async function getMeEmployerApplication(token) {
  try {
    const res = await get('/auth/employer/applications/me/', token);
    return unwrap(res) || res;
  } catch {
    return null;
  }
}

async function submitEmployerApplication(token, emp) {
  const fd = new FormData();
  fd.append('organization_name', emp.companyName);
  fd.append('organization_type', 'company');
  fd.append('industry', emp.industry);
  fd.append('registration_number', '');
  fd.append('phone', emp.phone || '+256700000000');
  fd.append('email', emp.email);
  fd.append('address', emp.location || 'Kampala, Uganda');
  fd.append('district', emp.district || 'Kampala');
  fd.append('reason_for_hiring', 'Showcase employer for Worket dashboard demo.');
  const res = await post('/auth/employer/applications/', fd, token);
  return unwrap(res) || res;
}

async function listAdminEmployerApplications(token, status = 'pending') {
  const path = `/auth/admin/employer/applications/?status=${status}`;
  const res = await get(path, token);
  const data = unwrap(res) || res;
  return data.results || data || [];
}

async function approveEmployerApplication(token, applicationId) {
  const res = await post(
    `/auth/admin/employer/applications/${applicationId}/approve/`,
    { is_pilot_employer: false },
    token
  );
  return unwrap(res) || res;
}

async function getMyCompanies(token) {
  try {
    const res = await get('/companies/my_companies/', token);
    const data = unwrap(res) || res;
    return Array.isArray(data) ? data : data.results || [];
  } catch {
    return [];
  }
}

async function createCompany(token, payload) {
  const fd = new FormData();
  fd.append('name', payload.name);
  fd.append('description', payload.description);
  fd.append('location', payload.location);
  fd.append('industry', payload.industry);
  const res = await post('/companies/', fd, token);
  return unwrap(res) || res;
}

async function patchCompanyFeatured(token, companyId, featured) {
  const res = await patch(`/companies/${companyId}/`, { is_featured: featured }, token);
  return unwrap(res) || res;
}

async function createJob(token, payload) {
  const fd = new FormData();
  fd.append('title', payload.title);
  fd.append('description', payload.description || payload.title);
  fd.append('location', payload.location || 'Kampala, Uganda');
  fd.append('job_type', 'full-time');
  const res = await post('/jobs/', fd, token);
  return unwrap(res) || res;
}

async function patchJobFeatured(token, jobId, featured) {
  const res = await patch(`/jobs/${jobId}/`, { is_featured: featured }, token);
  return unwrap(res) || res;
}

async function main() {
  console.log('Using API:', BASE);
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const created = { companies: [], jobs: [], logins: [] };
  const ourEmails = new Set(SHOWCASE_EMPLOYERS.map((e) => e.email));

  // 1. Register / login each employer and submit employer application if needed
  for (const emp of SHOWCASE_EMPLOYERS) {
    console.log('\n---', emp.companyName, '---');
    let access;
    try {
      access = (await login(emp.email, EMPLOYER_SHARED_PASSWORD)).access;
      console.log('  Login OK (user already exists)');
    } catch (e) {
      try {
        await register(emp.email, emp.firstName, emp.lastName, EMPLOYER_SHARED_PASSWORD);
        access = (await login(emp.email, EMPLOYER_SHARED_PASSWORD)).access;
        console.log('  Registered and logged in');
      } catch (err) {
        console.error('  Register/Login failed:', err.message);
        continue;
      }
    }

    created.logins.push({ email: emp.email, password: EMPLOYER_SHARED_PASSWORD, company: emp.companyName });

    const app = await getMeEmployerApplication(access);
    if (!app) {
      try {
        await submitEmployerApplication(access, emp);
        console.log('  Employer application submitted');
      } catch (err) {
        console.error('  Submit employer application failed:', err.message);
      }
    } else if (app.status === 'approved') {
      console.log('  Employer application already approved');
    } else {
      console.log('  Employer application status:', app.status);
    }
  }

  // 2. Admin approves applications, then we create companies + jobs
  if (!adminEmail || !adminPassword) {
    console.log('\n  Set ADMIN_EMAIL and ADMIN_PASSWORD, then run again to approve applications and create jobs.');
    console.log('\n--- Employer logins ---');
    created.logins.forEach((l) => console.log('  ', l.company, '|', l.email, '|', l.password));
    console.log('\nDone.');
    return;
  }

  let adminToken;
  try {
    adminToken = (await login(adminEmail, adminPassword)).access;
    console.log('\n--- Admin approved ---');
  } catch (e) {
    console.error('\n  Admin login failed:', e.message);
    console.log('\n--- Employer logins ---');
    created.logins.forEach((l) => console.log('  ', l.company, '|', l.email, '|', l.password));
    return;
  }

  const pending = await listAdminEmployerApplications(adminToken, 'pending');
  for (const app of pending) {
    const email = app.user?.email;
    if (email && ourEmails.has(email)) {
      try {
        await approveEmployerApplication(adminToken, app.id);
        console.log('  Approved application for', email);
      } catch (e) {
        console.error('  Approve failed for', email, e.message);
      }
    }
  }

  // 3. For each employer: ensure company exists, create jobs
  for (const emp of SHOWCASE_EMPLOYERS) {
    console.log('\n---', emp.companyName, '---');
    let access;
    try {
      access = (await login(emp.email, EMPLOYER_SHARED_PASSWORD)).access;
    } catch (e) {
      console.error('  Login failed:', e.message);
      continue;
    }

    let companies = await getMyCompanies(access);
    if (companies.length === 0) {
      try {
        const company = await createCompany(access, {
          name: emp.companyName,
          description: emp.description,
          location: emp.location,
          industry: emp.industry,
        });
        companies = [company];
        created.companies.push(company.id);
        console.log('  Company created id=', company.id);
      } catch (err) {
        console.error('  Create company failed:', err.message);
        continue;
      }
    } else {
      const cid = companies[0].id;
      if (!created.companies.includes(cid)) created.companies.push(cid);
      console.log('  Using existing company id=', cid);
    }

    for (const j of emp.jobs) {
      try {
        const job = await createJob(access, {
          title: j.title,
          description: j.title,
          location: emp.location,
        });
        created.jobs.push({
          id: job.id,
          featured: j.featured,
          title: j.title,
          employerEmail: emp.email,
        });
        console.log('  Job created:', j.title, 'id=', job.id);
      } catch (err) {
        console.error('  Create job failed:', j.title, err.message);
        if (String(err.message).includes('job posting permissions')) {
          console.error('    Hint: Backend may require company to be created after approval, or job-posting permissions to be granted.');
        }
      }
    }
  }

  // 4. Set featured (use employer tokens – API restricts company updates to "own company")
  console.log('\n--- Setting featured ---');
  for (const emp of SHOWCASE_EMPLOYERS) {
    let access;
    try {
      access = (await login(emp.email, EMPLOYER_SHARED_PASSWORD)).access;
    } catch {
      continue;
    }
    const companies = await getMyCompanies(access);
    if (companies.length === 0) continue;
    try {
      await patchCompanyFeatured(access, companies[0].id, true);
      console.log('  Company featured:', emp.companyName);
    } catch (e) {
      console.error('  Company featured failed', emp.companyName, ':', e.message);
    }
    for (const j of emp.jobs) {
      if (!j.featured) continue;
      const createdJob = created.jobs.find(
        (x) => x.employerEmail === emp.email && x.title === j.title && x.id
      );
      if (!createdJob) continue;
      try {
        await patchJobFeatured(access, createdJob.id, true);
        console.log('  Job featured:', j.title);
      } catch (e) {
        console.error('  Job featured failed', j.title, ':', e.message);
      }
    }
  }

  console.log('\n--- Employer logins (for dashboard showcase) ---');
  created.logins.forEach((l) => {
    console.log('  ', l.company, '|', l.email, '|', l.password);
  });
  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
