import { useEffect } from "react";
import { useLocation } from "wouter";

const HomePage = () => {
  const [, navigate] = useLocation();

  // Redirect to the profile page
  useEffect(() => {
    navigate("/profile");
  }, [navigate]);

  return null;
};

export default HomePage;
