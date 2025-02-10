import { useUser } from "../context/UserContext";

const Dashboard = () => {
  const { userEmail } = useUser();

  return (
    <div>
      <h1>Welcome to EcoCount</h1>
      <p>Logged in as: {userEmail}</p>
      <p>Select a section from the navbar to continue.</p>
    </div>
  );
};

export default Dashboard;
