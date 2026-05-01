import "./styles/login.css";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="login-page">
      <div className="form">
        <LoginForm />
      </div>
    </div>
  );
}