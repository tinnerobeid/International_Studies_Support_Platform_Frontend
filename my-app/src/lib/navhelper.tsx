import { useNavigate, useParams } from "react-router-dom";
import { goApply } from "../lib/navHelpers";

export default function UniversityProfilePage() {
  const nav = useNavigate();
  const { id } = useParams();

  return (
    <div>
      {/* ... your profile UI ... */}

      <button
        onClick={() =>
          goApply(nav, `/applications/new?type=university&universityId=${id}`)
        }
      >
        Apply
      </button>
    </div>
  );
}
