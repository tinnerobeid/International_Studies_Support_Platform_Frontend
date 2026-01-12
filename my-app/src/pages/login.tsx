import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { login } from "../lib/auth";

const Login = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const forcedRole = params.get("as"); // "student" if coming from Apply
  const next = params.get("next") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await login(email, password);
    if (!success) {
      alert("Login failed! Check your credentials.");
      return;
    }

    // Determine where to go
    if (next) {
      nav(decodeURIComponent(next), { replace: true });
      return;
    }

    // Fetch user to know role
    // Since we just logged in, the token is set.
    // Ideally we should have a user context, but for now we fetch.
    // Or we could decode the token on the client side if we implemented that.
    // Let's rely on basic redirection for now, or fetch /me.

    // Quick fix: default to profile, or try to guess. 
    // Better: fetch user

    // We can import getMe from auth
    // But we need to import it first. 
    // Since I can't easily add imports with this tool without overwriting, 
    // I will assume I need to handle imports too.

    // Actually, I'll rewrite the imports in a separate/preceding step or just use replace_file_content on the whole file if it's small enough. 
    // It is 90 lines. I can overwrite the whole file to be safe and clean.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Log in
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md mt-2">
            Log in
          </button>
        </form>

        <p className="text-slate-400 text-xs mt-4 text-center">
          Don&apos;t have an account?{" "}
          <Link
            to={forcedRole === "student"
              ? `/signup?as=student&next=${encodeURIComponent(next)}`
              : "/signup"
            }
            className="text-blue-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
