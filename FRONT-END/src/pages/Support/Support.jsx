import React, { useState, useContext } from "react";
import "./Support.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const Support = () => {
  const { accessToken, refreshToken, url, user, setAccessToken, logout } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      toast.error("You must be logged in to send a support message.");
      return;
    }

    try {
      const res = await axios.post(
        `${url}/api/support`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (res.data.message) {
        setSubmitted(true);
        toast.success("Your support message has been sent successfully!");
        setFormData({ ...formData, subject: "", message: "" });
      }
    } catch (err) {
      // If 401, try refreshing token
      if (err.response?.status === 401 && refreshToken) {
        try {
          const refreshRes = await axios.post(`${url}/api/users/refresh`, { refreshToken });
          if (refreshRes.data.success) {
            setAccessToken(refreshRes.data.accessToken);
            localStorage.setItem("accessToken", refreshRes.data.accessToken);

            // Retry sending the support message
            const retryRes = await axios.post(
              `${url}/api/support`,
              formData,
              {
                headers: { Authorization: `Bearer ${refreshRes.data.accessToken}` }
              }
            );

            if (retryRes.data.message) {
              setSubmitted(true);
              toast.success("Your support message has been sent successfully!");
              setFormData({ ...formData, subject: "", message: "" });
            }
          } else {
            toast.error("Session expired. Please login again.");
            logout();
          }
        } catch (refreshErr) {
          toast.error("Session expired. Please login again.");
          logout();
        }
      } else {
        const msg = err.response?.data?.error || "Failed to send support message.";
        toast.error(msg);
      }
    }
  };

  return (
    <div className="support-container">
      <h1>Contact Support</h1>
      <p>
        We're here to help! If you have any questions, issues, or feedback regarding our products or services,
        please reach out using the form below or via the provided contact details.
      </p>

      <div className="support-info">
        <h3>Email:</h3>
        <p><a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a></p>
        <h3>Phone:</h3>
        <p>+91 1234567890</p>
        <h3>Address:</h3>
        <p>123 Art Street, Your City, Your Country</p>
      </div>

      <form className="support-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="6"
        ></textarea>
        <button type="submit" disabled={!accessToken}>
          {accessToken ? "Send Message" : "Login to Send"}
        </button>
        {submitted && <p className="success-message">Thank you! Your message has been sent.</p>}
      </form>
    </div>
  );
};

export default Support;
