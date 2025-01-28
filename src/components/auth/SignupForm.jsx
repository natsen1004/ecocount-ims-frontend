import { useState } from 'react';

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const apiUrl = "https://ecocount-ims-backend.onrender.com/signup"; // Adjust the endpoint for signup

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sign up");
      }

      const data = await response.json();
      console.log("Sign up successful:", data);

      window.location.href = "/login";
    } catch (error) {
      console.error("Error during sign up:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="form-label" htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>

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
        <label className="form-label" htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={handleRoleChange}
          className="form-select"
          required
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option> 
        </select>
      </div>

      {errorMessage && <p className="text-danger">{errorMessage}</p>}

      <button
        type="submit"
        className="btn btn-primary btn-block mb-4"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
};

export default SignUpForm;
