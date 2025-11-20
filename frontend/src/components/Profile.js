import React, { useEffect, useState } from "react";
import API from "../api";

const Profile = ({ user, setUser }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    university: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      API.get("/auth/me")
        .then((res) => {
          setProfileData(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            bio: res.data.bio || "",
            university: res.data.university || "",
            role: res.data.role || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    API.put("/auth/me", formData)
      .then((res) => {
        setProfileData(res.data);
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {!editMode ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Role:</strong> {profileData.role}</p>
          <p><strong>University:</strong> {profileData.university || "N/A"}</p>
          <p><strong>Bio:</strong> {profileData.bio || "N/A"}</p>
          <button className="btn" onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Role"
          />
          <input
            type="text"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="University"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <div className="profile-buttons">
            <button className="btn save" onClick={handleUpdate}>Save</button>
            <button className="btn cancel" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
