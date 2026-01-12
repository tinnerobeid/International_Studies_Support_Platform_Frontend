import "./styles/profile.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSession, isLoggedIn } from "../lib/auth";
import {
  getApplyTargetForScholarship,
  requireStudentLoginUrl,
} from "../lib/applyGuard";

const mockScholarships: Record<string, any> = {
  "1": {
    id: "1",
    title: "GKS Scholarship",
    provider: "Korean Government",
    fundingType: "Full",
    deadline: "2026-03-31",
    degreeLevels: ["Bachelors", "Masters", "PhD"],
    coverage: ["Full tuition", "Monthly stipend", "Health insurance", "Flight support (varies)"],
    eligibility: ["International students", "Strong academic record", "Meets country quota requirements"],
    documentsRequired: ["Passport", "Transcript", "SOP", "Recommendation letters", "Medical form"],
    timeline: ["Applications open: Feb", "Deadline: Mar 31", "Interviews: Apr", "Results: May/Jun"],
    howToApply: ["Check embassy/university track", "Prepare documents", "Submit before deadline", "Wait for screening results"],
    applicationLink: "https://www.studyinkorea.go.kr/",
    description: "Government-funded scholarship for international students to study in Korea.",
  },
  "2": {
    id: "2",
    title: "KDU International Scholarship",
    provider: "Kyungdong University",
    fundingType: "Partial",
    deadline: "2026-04-15",
    degreeLevels: ["Bachelors"],
    coverage: ["Partial tuition reduction"],
    eligibility: ["International applicants", "Minimum GPA requirement"],
    documentsRequired: ["Passport", "Transcript", "SOP"],
    timeline: ["Apply with admission", "Scholarship decision after review"],
    howToApply: ["Apply to KDU", "Select scholarship option", "Submit required docs"],
    applicationLink: "https://www.kduniv.ac.kr/",
    description: "University scholarship supporting international students at KDU.",
  },
};

export default function ScholarshipProfilePage() {
  const nav = useNavigate();
  const { id } = useParams();
  const s = (id && mockScholarships[id]) || null;

  if (!s) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Link to="/scholarships" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
          <h1 className="text-xl font-bold">Scholarship not found</h1>
          <p className="text-sm text-gray-600">Try /scholarships/1 or /scholarships/2</p>
        </div>
      </div>
    );
  }

  const applyTarget = getApplyTargetForScholarship(String(s.id));

  function handleApply() {
    // Not logged in -> force student login
    if (!isLoggedIn()) {
      nav(requireStudentLoginUrl(applyTarget));
      return;
    }

    // Logged in but wrong role -> block
    const role = getSession()?.role;
    if (role !== "student") {
      alert("Only students can apply. University accounts are created by admin.");
      return;
    }

    // Student -> go to application create flow
    nav(applyTarget);
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Link to="/scholarships" className="text-sm text-gray-600 hover:underline">← Back to Scholarships</Link>

      <div className="mt-3 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{s.title}</h1>
            <p className="text-sm text-gray-600">{s.provider}</p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" type="button">
              Save Scholarship
            </button>
            <button
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500"
              type="button"
              onClick={handleApply}
            >
              Apply
            </button>

            {/* Optional: keep external link as “Official site” */}
            {s.applicationLink && (
              <a
                className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                href={s.applicationLink}
                target="_blank"
                rel="noreferrer"
              >
                Official Site ↗
              </a>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full border px-3 py-1">{s.fundingType}</span>
          <span className="rounded-full border px-3 py-1">Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
          <span className="rounded-full border px-3 py-1">{s.degreeLevels.join(", ")}</span>
        </div>

        <div className="mt-5">
          <h2 className="font-semibold">Description</h2>
          <p className="mt-1 text-sm text-gray-700">{s.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <Section title="Coverage" items={s.coverage} />
          <Section title="Eligibility" items={s.eligibility} />
          <Section title="Required Documents" items={s.documentsRequired} />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <Section title="Timeline" items={s.timeline} />
          <Section title="How to Apply" items={s.howToApply} />

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Actions</h2>
            <div className="mt-3 flex flex-col gap-2">
              <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" type="button">
                Add to Tracker
              </button>
              <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" type="button">
                Mark Documents Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-3 space-y-2">
        {items.map((x, i) => (
          <div key={i} className="rounded-xl border p-3 text-sm text-gray-700">{x}</div>
        ))}
      </div>
    </div>
  );
}
