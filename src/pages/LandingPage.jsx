import LoginForm from '../components/auth/LoginForm'; 

const LandingPage = () => {
  return (
    <div>
      <main>
        <h1>Welcome to EcoCount IMS</h1>
        <p>Your one-stop solution for inventory management and sustainability tracking.</p>

        <LoginForm />
      </main>
    </div>
  );
};

export default LandingPage;
