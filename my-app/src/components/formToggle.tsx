import { useState, useEffect, useRef } from "react";
import { Login } from "./Login"; // Adjust path as needed
import { SignUp } from "./SignUp"; // Adjust path as needed

export default function FormToggle() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [formHeight, setFormHeight] = useState<number>(0);
  const panelOneRef = useRef<HTMLDivElement>(null);
  const panelTwoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculate initial height
    if (panelOneRef.current) {
      setFormHeight(panelOneRef.current.scrollHeight);
    }
  }, []);

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUpActive(true);
    
    if (panelTwoRef.current && formRef.current) {
      const panelTwoHeight = panelTwoRef.current.scrollHeight;
      setFormHeight(panelTwoHeight);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSignUpActive(false);
    
    if (panelOneRef.current) {
      const panelOneHeight = panelOneRef.current.scrollHeight;
      setFormHeight(panelOneHeight);
    }
  };

  return (
    <div className="form-container" style={{ minHeight: formHeight }}>
      <div className="form" ref={formRef} style={{ height: formHeight }}>
        <div 
          className={`form-panel one ${isSignUpActive ? 'hidden' : 'active'}`} 
          ref={panelOneRef}
        >
          <Login />
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button 
              onClick={handleSignUpClick}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
        
        <div 
          className={`form-panel two ${isSignUpActive ? 'active' : ''}`} 
          ref={panelTwoRef}
        >
          <SignUp />
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button 
              onClick={handleToggleClick}
              className="text-blue-600 hover:underline font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}