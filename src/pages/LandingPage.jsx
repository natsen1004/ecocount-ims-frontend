import LoginForm from "../components/auth/LoginForm";
import '../styles/LandingPage.css';
const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="content-wrapper">
        <div className="left-side">
          <div className="description">
            <div className="logo-container">
              {/* <img src={logo} alt="EcoCount Logo" className="logo" /> */}
              <h1>EcoCount IMS</h1>
            </div>
            <h2>Manage Your Inventory Efficiently</h2>
            <p>
              Stay organized, optimize stock levels, and ensure sustainability with
              our intuitive platform.
            </p>
          </div>
        </div>
        
        <div className="right-side">
          <div className="login-section">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


