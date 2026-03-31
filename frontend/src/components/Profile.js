import React, { useEffect, useState } from "react";
import API from "../api";

const Profile = ({ user, setUser }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", bio: "", university: "", role: "",
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

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = () => {
    setSaving(true);
    API.put("/auth/me", formData)
      .then((res) => {
        setProfileData(res.data);
        setUser(res.data);
        setEditMode(false);
      })
      .catch((err) => console.error(err))
      .finally(() => setSaving(false));
  };

  if (loading || !user) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <div className="profile-loading">
            {!user ? "Please log in to view your profile." : "Loading profile..."}
          </div>
        </div>
      </div>
    );
  }

  const initials = profileData?.name
    ? profileData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        <div className="profile-card">

          {/* Purple gradient banner */}
          <div className="profile-banner" />

          {/* Card body */}
          <div className="profile-body">

            {/* Avatar + Edit button row – translateY pulls it over the banner */}
            <div className="profile-avatar-row">
              <div className="profile-avatar">{initials}</div>
              {!editMode && (
                <button className="btn-edit-profile" onClick={() => setEditMode(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!editMode ? (
              <>
                {/* Name */}
                <div className="profile-name">{profileData.name}</div>

                {/* Role badge */}
                <div className="profile-role-badge">
                  {profileData.role === "student" ? "🎓" : "🏆"} {profileData.role}
                </div>

                {/* Info grid */}
                <div className="profile-info-grid">
                  <div className="profile-info-item">
                    <div className="profile-info-label">📧 Email</div>
                    <div className="profile-info-value">{profileData.email}</div>
                  </div>
                  <div className="profile-info-item">
                    <div className="profile-info-label">🏫 University</div>
                    <div className="profile-info-value">{profileData.university || "Not set"}</div>
                  </div>
                </div>

                {/* Bio */}
                <div className="profile-bio-section">
                  <div className="profile-info-label">📝 Bio</div>
                  <div className="profile-bio-text">
                    {profileData.bio || "No bio added yet."}
                  </div>
                </div>
              </>
            ) : (
              <div className="profile-form">
                <div className="profile-field-group">
                  <span className="profile-field-label">Full Name</span>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="profile-field-group">
                  <span className="profile-field-label">Email Address</span>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" />
                </div>
                <div className="profile-field-group">
                  <span className="profile-field-label">University</span>
                  <input type="text" name="university" value={formData.university} onChange={handleChange} placeholder="Your university name" />
                </div>
                <div className="profile-field-group">
                  <span className="profile-field-label">Bio</span>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={4} />
                </div>
                <div className="profile-buttons">
                  <button className="btn-save" onClick={handleUpdate} disabled={saving}>
                    {saving ? "Saving..." : "✓ Save Changes"}
                  </button>
                  <button className="btn-cancel" onClick={() => setEditMode(false)}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}

          </div>{/* /profile-body */}
        </div>{/* /profile-card */}
      </div>
    </div>
  );
};

export default Profile;