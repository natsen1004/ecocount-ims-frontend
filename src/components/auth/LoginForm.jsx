import { useState } from 'react';

const LoginForm = () => {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.value)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const apiUrl = "https://ecocount-ims-backend.onrender.com/login";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          rememberMe,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during login:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="form-label" htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>

      <div>
        <div className="form-check">
          <label className="form-check-label" htmlFor="remember-me">Remember Me</label>
          <input 
            className="form-check-input"
            type="checkbox"
            value=""
            id="check-box"
            checked={rememberMe}
            onChange={handleRememberMe}
          />
        </div>
      </div>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <button
        type="submit"
        data-mdb-button-init
        data-mdb-ripple-init
        className="btn btn-primary btn-block mb-4"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;



