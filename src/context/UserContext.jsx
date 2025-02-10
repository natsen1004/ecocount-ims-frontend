import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      setUserId(null); 
      return;
    }

    const fetchUserId = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://ecocount-ims-backend.onrender.com/users/get_user_id",
          { params: { user_email: userEmail } }
        );

        if (response.data.user_id) {
          setUserId(response.data.user_id);
          console.log("User ID fetched:", response.data.user_id);
        } else {
          console.error("No user ID found for this email.");
          setUserId(null);
          setError("No user found.");
        }
      } catch (error) {
        console.error(" Failed to fetch user ID:", error);
        setError("Error fetching user ID.");
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [userEmail]);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail, userId, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};



