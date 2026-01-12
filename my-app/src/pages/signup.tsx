import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { signup } from "../lib/auth";




const Signup = () => {
  const nav = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params] = useSearchParams();
  // const next = params.get("next") || ""; // Not used currently

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await signup(email, password, fullName, "student");

    if (success) {
      alert("Account created! Please log in.");
      nav("/login");
    } else {
      alert("Signup failed. Email usage?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Full name
            </label>
            <input
              type="text"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-md mt-2"
          >
            Sign up
          </button>
        </form>

        <p className="text-slate-400 text-xs mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
