import { type FormEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { login } from "../../lib/auth";

type Role = "student" | "university";

export default function LoginForm() {
    const nav = useNavigate();
    const [params] = useSearchParams();

    const next = useMemo(() => params.get("next") || "", [params]);
    const asRole = (params.get("as") as Role | null) ?? null;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        let role: Role = "student";
        if (asRole) role = asRole;
        else if (email.includes("admin") || email.includes("uni") || email.includes("korea")) role = "university";

        login(email, role);

        if (next) nav(next);
        else nav(role === "university" ? "/admin/dashboard" : "/profile");
    };

    return (
        <div className="auth-card">
            <div className="form-header">
                <h1>Account Login</h1>
            </div>
            <div className="form-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={email || ""}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password || ""}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-remember">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Remember Me
                        </label>
                        <a className="form-recovery" href="#">Forgot Password?</a>
                    </div>
                    <div className="form-group">
                        <button type="submit">Log In</button>
                    </div>
                    <div className="form-group">
                        <p className="text-center w-full mt-4 text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 cursor-pointer hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
