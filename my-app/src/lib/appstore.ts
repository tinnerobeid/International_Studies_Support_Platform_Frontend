export type AppStatus = "Draft" | "Submitted" | "Under Review" | "Interview" | "Accepted" | "Rejected";
export type AppType = "University" | "Scholarship";

export type Application = {
  id: string;
  type: AppType;
  title: string;
  status: AppStatus;
  deadline?: string;

  universityId?: string;
  scholarshipId?: string;

  programName?: string;
  intake?: "Spring" | "Fall";
  notes?: string;

  studentName: string;
  createdAt: string;
  updatedAt: string;

  adminNotes?: string;
};

type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

const KEY_APPS = "kstudy_apps_v1";
const KEY_NOTIFS = "kstudy_notifs_v1";
const KEY_USER = "kstudy_user_v1";

export type UserRole = "student" | "university" | "admin";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  name: string;
};

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(KEY_USER);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function login(email: string, role: UserRole) {
  const user: User = {
    id: "u_" + Date.now(),
    email,
    role,
    name: email.split("@")[0] || "User",
  };
  localStorage.setItem(KEY_USER, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(KEY_USER);
}

function nowISO() {
  return new Date().toISOString();
}

function uid(prefix = "a") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function seedIfEmpty() {
  const apps = loadApplications();
  if (apps.length > 0) return;

  const seeded: Application[] = [
    {
      id: "app_1",
      type: "Scholarship",
      title: "GKS Scholarship (Embassy Track)",
      status: "Draft",
      deadline: "2026-03-31",
      scholarshipId: "1",
      intake: "Fall",
      notes: "Prepare SOP + recommendation letters.",
      studentName: "Christina Obeid",
      createdAt: nowISO(),
      updatedAt: nowISO(),
    },
    {
      id: "app_2",
      type: "University",
      title: "Kyungdong University — Computer Science",
      status: "Submitted",
      deadline: "2026-04-10",
      universityId: "1",
      programName: "Computer Science",
      intake: "Fall",
      notes: "Submitted online form. Waiting for response.",
      studentName: "Christina Obeid",
      createdAt: nowISO(),
      updatedAt: nowISO(),
      adminNotes: "Check transcript formatting.",
    },
  ];

  saveApplications(seeded);

  saveNotifications([
    {
      id: "n1",
      title: "Deadline coming soon",
      body: "GKS Scholarship deadline is approaching. Make sure your SOP is ready.",
      createdAt: nowISO(),
      read: false,
    },
    {
      id: "n2",
      title: "Application submitted",
      body: "Your KDU application is marked as Submitted.",
      createdAt: nowISO(),
      read: true,
    },
  ]);
}

export function loadApplications(): Application[] {
  const raw = localStorage.getItem(KEY_APPS);
  if (!raw) return [];
  try { return JSON.parse(raw) as Application[]; } catch { return []; }
}

export function saveApplications(apps: Application[]) {
  localStorage.setItem(KEY_APPS, JSON.stringify(apps));
}

export function createApplication(input: Omit<Application, "id" | "createdAt" | "updatedAt">) {
  const apps = loadApplications();
  const app: Application = {
    ...input,
    id: uid("app"),
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  apps.unshift(app);
  saveApplications(apps);

  pushNotification({
    title: "Application created",
    body: `Created a new ${app.type} application: ${app.title}`,
  });

  return app;
}

export function updateApplication(id: string, patch: Partial<Application>) {
  const apps = loadApplications();
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return null;

  apps[idx] = { ...apps[idx], ...patch, updatedAt: nowISO() };
  saveApplications(apps);

  if (patch.status) {
    pushNotification({
      title: "Application status updated",
      body: `${apps[idx].title} is now ${apps[idx].status}.`,
    });
  }

  return apps[idx];
}

export function getApplication(id: string) {
  return loadApplications().find(a => a.id === id) || null;
}

/* Notifications */
export function loadNotifications(): Notification[] {
  const raw = localStorage.getItem(KEY_NOTIFS);
  if (!raw) return [];
  try { return JSON.parse(raw) as Notification[]; } catch { return []; }
}

export function saveNotifications(notifs: Notification[]) {
  localStorage.setItem(KEY_NOTIFS, JSON.stringify(notifs));
}

export function pushNotification(input: { title: string; body: string }) {
  const notifs = loadNotifications();
  const n: Notification = {
    id: uid("n"),
    title: input.title,
    body: input.body,
    createdAt: nowISO(),
    read: false,
  };
  notifs.unshift(n);
  saveNotifications(notifs);
}

export function markAllRead() {
  const notifs = loadNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(notifs);
}

export function unreadCount() {
  return loadNotifications().filter(n => !n.read).length;
}
