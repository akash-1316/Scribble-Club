import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import './profile.css'
import assets from "../../assets/assets";
const Profile = () => {
  const { user, updateProfile, uploadProfilePicture, url } = useContext(StoreContext);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleUpdate = () => {
    updateProfile({ name, email });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) uploadProfilePicture(file);
  };

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      <div className="profile-pic">
        <img
          src={user?.profilePic ? `${url}${user.profilePic}` : assets.profile_default }
          alt="Profile"
          width="120"
          height="120"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="profile-info">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <button onClick={handleUpdate}>Update Profile</button>
      </div>
    </div>
  );
};

export default Profile;
