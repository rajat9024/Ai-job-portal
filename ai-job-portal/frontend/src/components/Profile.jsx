import React, { useState, useEffect } from "react";
import API from "../api";
import JobSeekerProfile from "./JobSeekerProfile";
import EmployerProfile from "./EmployerProfile";
import "../components/Profile.css"
function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/me"); // ✅ backend mount path
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No profile found</p>;

  return (
    <>
      {user.role === "employer" ? (
        <EmployerProfile user={user} />
      ) : (
        <JobSeekerProfile user={user} />
      )}
    </>
  );
}

export default Profile;
