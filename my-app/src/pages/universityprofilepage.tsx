import "./styles/profile.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getSession } from "../lib/auth";

const mockUniversities: Record<string, any> = {
  "1": {
    id: "1",
    name: "Kyungdong University (KDU)",
    city: "Gangwon-do",
    website: "https://www.kduniv.ac.kr/",
    description:
      "Kyungdong University offers diverse programs with strong support for international students.",
    admissionRequirements: [
      "High school diploma / previous degree certificate",
      "Transcript",
      "Proof of English (or Korean) ability",
      "Passport copy",
    ],
    programs: [
      { id: "p1", name: "Computer Science", level: "Bachelors", language: "English", durationYears: 4, tuitionPerSemester: 3200000, intake: "Fall" },
      { id: "p2", name: "AI & Data Science", level: "Masters", language: "English", durationYears: 2, tuitionPerSemester: 3800000, intake: "Spring" },
    ],
  },
  "2": {
    id: "2",
    name: "Korea University",
    city: "Seoul",
    website: "https://www.korea.edu/",
    description: "A top research university in Korea with many global programs.",
    admissionRequirements: ["Degree certificate", "Transcript", "Language certificate", "Recommendation letters"],
    programs: [{ id: "p3", name: "Software Engineering", level: "Masters", language: "English", durationYears: 2, tuitionPerSemester: 4500000, intake: "Fall" }],
  },
};

export default function UniversityProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const u = (id && mockUniversities[id]) || null;

  const handleApplyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (session) {
      navigate("/profile");
    } else {
      navigate("/login?as=student&next=/profile");
    }
  };

  if (!u) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <Link to="/universities" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
          <h1 className="text-xl font-bold">University not found</h1>
          <p className="text-sm text-gray-600">Try /universities/1 or /universities/2</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <Link to="/universities" className="text-sm text-gray-600 hover:underline">← Back to Universities</Link>

      <div className="mt-3 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{u.name}</h1>
            <p className="text-sm text-gray-600">{u.city} • South Korea</p>
          </div>

          <div className="flex gap-2">
            <button className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" type="button">
              Save University
            </button>
            {u.website && (
              <a className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50" href={u.website} target="_blank" rel="noreferrer">
                Website ↗
              </a>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h2 className="font-semibold">About</h2>
          <p className="mt-1 text-sm text-gray-700">{u.description}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Programs</h2>

            <div className="mt-4 space-y-3">
              {u.programs.map((p: any) => (
                <div key={p.id} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-gray-600">
                        {p.level} • {p.language} • {p.durationYears} yrs
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <Tag text={`Intake: ${p.intake}`} />
                        <Tag text={`₩${p.tuitionPerSemester.toLocaleString()}/semester`} />
                      </div>
                    </div>

                    <button className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50" type="button">
                      Save Program
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Admission Requirements</h2>
            <div className="mt-3 space-y-2">
              {u.admissionRequirements.map((r: string, i: number) => (
                <div key={i} className="rounded-xl border p-3 text-sm text-gray-700">{r}</div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Scholarships</h2>
            <p className="mt-2 text-sm text-gray-600">Browse scholarships and save what fits you.</p>
            <Link to="/scholarships" className="mt-3 inline-block text-sm hover:underline">
              Browse Scholarships →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return <span className="rounded-full border px-3 py-1">{text}</span>;
}
