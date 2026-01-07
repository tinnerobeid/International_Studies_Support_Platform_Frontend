import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type DegreeLevel = "Bachelors" | "Masters" | "PhD";

type CreateProgramPayload = {
  name: string;
  universityId: string;
  level: DegreeLevel;
  department?: string;
  tuitionPerSemester?: number;
  language?: string;
  intake?: "Spring" | "Fall";
  durationYears?: number;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

async function createProgram(payload: CreateProgramPayload) {
  const res = await fetch(`${API_BASE}/admin/programs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || "Failed to create program");
  }
}

export default function AdminProgramCreatePage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<CreateProgramPayload>({
    name: "",
    universityId: "",
    level: "Bachelors",
  });

  const submit = async () => {
    setErr(null);
    if (!form.name.trim()) return setErr("Program name is required.");
    if (!form.universityId.trim()) return setErr("University ID is required.");

    try {
      setLoading(true);
      await createProgram({
        ...form,
        tuitionPerSemester:
          typeof form.tuitionPerSemester === "number" ? form.tuitionPerSemester : undefined,
        durationYears:
          typeof form.durationYears === "number" ? form.durationYears : undefined,
      });
      nav("/admin/programs");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Program</h1>
          <p className="text-sm text-gray-600">Add a new program under a Korean university.</p>
        </div>
        <Link to="/admin/programs" className="text-sm hover:underline">Back</Link>
      </div>

      <div className="mt-5 rounded-2xl border bg-white p-5 shadow-sm">
        {err && <p className="mb-3 text-sm text-red-600">{err}</p>}

        <Field label="Program name">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Computer Science"
          />
        </Field>

        <Field label="University ID (temporary)">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.universityId}
            onChange={(e) => setForm({ ...form, universityId: e.target.value })}
            placeholder="e.g. kdu-001"
          />
          <p className="mt-1 text-xs text-gray-500">
            Later we’ll replace this with a dropdown fetched from /admin/universities.
          </p>
        </Field>

        <Field label="Level">
          <select
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as DegreeLevel })}
          >
            <option value="Bachelors">Bachelors</option>
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
          </select>
        </Field>

        <Field label="Department (optional)">
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.department ?? ""}
            onChange={(e) => setForm({ ...form, department: e.target.value || undefined })}
            placeholder="Smart Computing Department"
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Tuition / semester (₩)">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={form.tuitionPerSemester ?? ""}
              onChange={(e) =>
                setForm({ ...form, tuitionPerSemester: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 3200000"
            />
          </Field>

          <Field label="Duration (years)">
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 text-sm"
              value={form.durationYears ?? ""}
              onChange={(e) =>
                setForm({ ...form, durationYears: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 4"
            />
          </Field>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={submit}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Program"}
          </button>

          <Link to="/admin/programs" className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50">
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-sm font-medium">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
