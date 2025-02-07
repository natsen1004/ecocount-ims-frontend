import { useState } from 'react';
import SignupForm from './SignUpForm'; 
import '../../styles/AuthForms.css'; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
  
    const apiUrl = "https://ecocount-ims-backend.onrender.com/auth/login"
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,  
          password,
          rememberMe  
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log in"); 
      }
  
      const data = await response.json();
      console.log("Login successful:", data);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during login:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="auth-container">
      {!showSignup ? (
        <>
          <h2 className="login-form-h2">Login</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="email">Email address</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} required />
            </div>

            <div>
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
              <button
                  type="button"
                  className="show-password-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            <div className="form-check">
              <label className="form-check-label" htmlFor="remember-me">Remember Me</label>
              <input className="form-check-input" type="checkbox" id="remember-me" checked={rememberMe} onChange={handleRememberMe} />
            </div>

            {errorMessage && <p className="text-danger">{errorMessage}</p>}

            <button type="submit" className="btn btn-primary btn-block mb-4" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="toggle-text">
            Don`t have an account?{" "}
            <button className="toggle-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
          </p>
        </>
      ) : (
        <>
          <SignupForm />
          <p className="toggle-text">
            Already have an account?{" "}
            <button className="toggle-btn" onClick={() => setShowSignup(false)}>Login</button>
          </p>
        </>
      )}
    </div>
  );
};

export default LoginForm;




