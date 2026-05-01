import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../lib/auth";

export default function RegisterForm() {
    const nav = useNavigate();
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        if (!regEmail || !regPassword || !regUsername) return;
        if (regPassword !== regConfirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert(`Registration successful for ${regUsername}! Logging you in...`);
        login(regEmail, "student");
        nav("/profile");
    };

    return (
        <div className="auth-card">
            <div className="form-header">
                <h1>Register Account</h1>
            </div>
            <div className="form-content">
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor="reg-username">Username</label>
                        <input
                            id="reg-username"
                            type="text"
                            required
                            value={regUsername || ""}
                            onChange={(e) => setRegUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            required
                            value={regPassword || ""}
                            onChange={(e) => setRegPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-confirm-password">Confirm Password</label>
                        <input
                            id="reg-confirm-password"
                            type="password"
                            required
                            value={regConfirmPassword || ""}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-email">Email Address</label>
                        <input
                            id="reg-email"
                            type="email"
                            required
                            value={regEmail || ""}
                            onChange={(e) => setRegEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit">Register</button>
                    </div>
                    <div className="form-group">
                        <p className="text-center w-full mt-4 text-sm text-white">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold cursor-pointer hover:underline"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
