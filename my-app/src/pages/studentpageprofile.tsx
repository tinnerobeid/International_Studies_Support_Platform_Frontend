import { useState } from "react";
import { Link } from "react-router-dom";

export default function StudentProfilePage() {
  const [tab, setTab] = useState<"overview" | "saved" | "tracker" | "documents">("overview");

  // ✅ Mock data (replace later)
  const student = {
    fullName: "Christina Obeid",
    email: "christina@example.com",
    nationality: "Tanzania",
    currentCountry: "South Korea",
    targetDegree: "Bachelors",
    targetIntake: "Fall 2026",
    bio: "I’m exploring Korean universities and scholarships in Computer Science.",
  };

  const savedUniversities = [
    { id: "1", title: "Kyungdong University (KDU)", subtitle: "Gangwon-do, Korea", href: "/universities/1" },
    { id: "2", title: "Korea University", subtitle: "Seoul, Korea", href: "/universities/2" },
  ];

  const savedScholarships = [
    { id: "1", title: "GKS Scholarship", subtitle: "Deadline: Mar 31, 2026", href: "/scholarships/1" },
    { id: "2", title: "KDU International Scholarship", subtitle: "Deadline: Apr 15, 2026", href: "/scholarships/2" },
  ];

  const tracker = [
    { id: "t1", title: "GKS Scholarship", type: "Scholarship", status: "Draft", deadline: "2026-03-31" },
    { id: "t2", title: "Kyungdong University", type: "University", status: "Submitted", deadline: "2026-04-10" },
  ];

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-gray-600">Your dashboard for studying in Korea.</p>
        </div>
        <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" type="button">
          Edit Profile
        </button>
      </div>

      {/* Profile card */}
      <div className="mt-5 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xl font-semibold">{student.fullName}</p>
        <p className="text-sm text-gray-600">{student.email}</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Info label="Nationality" value={student.nationality} />
          <Info label="Current Country" value={student.currentCountry} />
          <Info label="Target Degree" value={student.targetDegree} />
          <Info label="Target Intake" value={student.targetIntake} />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Bio</p>
          <p className="mt-1 text-sm text-gray-700">{student.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Tab active={tab === "overview"} onClick={() => setTab("overview")}>Overview</Tab>
        <Tab active={tab === "saved"} onClick={() => setTab("saved")}>Saved</Tab>
        <Tab active={tab === "tracker"} onClick={() => setTab("tracker")}>Tracker</Tab>
        <Tab active={tab === "documents"} onClick={() => setTab("documents")}>Documents</Tab>
      </div>

      {/* Content */}
      <div className="mt-4">
        {tab === "overview" && (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Stat title="Saved Universities" value={String(savedUniversities.length)} />
              <Stat title="Saved Scholarships" value={String(savedScholarships.length)} />
              <Stat title="Tracked Items" value={String(tracker.length)} />
            </div>
          </div>
        )}

        {tab === "saved" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SavedPanel title="Saved Universities" items={savedUniversities} emptyText="No saved universities yet." />
            <SavedPanel title="Saved Scholarships" items={savedScholarships} emptyText="No saved scholarships yet." />
          </div>
        )}

        {tab === "tracker" && (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Application Tracker</h2>
            <div className="mt-4 space-y-2">
              {tracker.map((t) => (
                <div key={t.id} className="rounded-xl border p-4">
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-gray-600">{t.type} • {t.status}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Deadline: {new Date(t.deadline).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "documents" && (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Documents</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {["Passport", "Transcript", "SOP", "Recommendation Letters", "CV", "TOPIK/IELTS/TOEFL"].map((x) => (
                <div key={x} className="rounded-xl border p-4">
                  <p className="font-semibold">{x}</p>
                  <p className="mt-1 text-sm text-gray-600">Upload later</p>
                  <button className="mt-3 rounded-xl border px-3 py-1 text-sm hover:bg-gray-50" type="button">
                    Upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm hover:bg-gray-50 ${active ? "font-semibold" : ""}`}
    >
      {children}
    </button>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function SavedPanel({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: { id: string; title: string; subtitle?: string; href: string }[];
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((it) => (
          <Link key={it.id} to={it.href} className="block rounded-xl border p-4 hover:bg-gray-50">
            <p className="font-semibold">{it.title}</p>
            {it.subtitle && <p className="text-sm text-gray-600">{it.subtitle}</p>}
          </Link>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-600">{emptyText}</p>}
      </div>
    </div>
  );
}
