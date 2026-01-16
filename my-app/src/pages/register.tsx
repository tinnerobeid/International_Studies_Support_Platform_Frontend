import "./styles/login.css";
import RegisterForm from "../components/auth/RegisterForm";

export default function Register() {
    return (
        <div className="login-page">
            <div className="form">
                <RegisterForm />
            </div>
        </div>
    );
}
