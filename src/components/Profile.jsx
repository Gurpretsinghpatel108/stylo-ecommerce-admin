import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const profileId = "PUT_YOUR_PROFILE_ID_HERE"; // Apna MongoDB ka _id dalna

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/profile/${profileId}`)
      .then((res) => {
        if (res.data.success && res.data.data) {
          setProfile((prev) => ({
            ...prev,
            fullName: res.data.data.fullName || "",
            email: res.data.data.email || "",
            phone: res.data.data.phone || "",
            password: "",
            confirmPassword: "",
            profilePicture: null,
          }));
        }
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, [profileId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.password && profile.password !== profile.confirmPassword) {
      alert("Password and Confirm Password do not match!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      if (profile.password) formData.append("password", profile.password);
      if (profile.profilePicture) formData.append("profilePicture", profile.profilePicture);

      const res = await axios.put(
        `http://localhost:5000/api/profile/${profileId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        setProfile((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        alert(res.data.message || "Error updating profile");
      }
    } catch (err) {
      console.error("Profile update error:", err.response ? err.response.data : err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>Admin Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" value={profile.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" name="profilePicture" onChange={handleFileChange} />
        </div>

        <div className="form-group">
          <label>New Password (optional)</label>
          <input type="password" name="password" value={profile.password} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={profile.confirmPassword} onChange={handleChange} />
        </div>

        <button type="submit" className="submit-btn">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
