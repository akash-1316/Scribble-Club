import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Messages.css";

const Messages = () => {
  const navigate = useNavigate();
  const { token, isAdmin, authRequest } = useContext(StoreContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!token || !isAdmin) {
      toast.error("Please login as admin");
      navigate("/");
      return;
    }

    try {
      const response = await authRequest.get("/api/support");
      
      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        toast.error(response.data.message || "Failed to load messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token, isAdmin]);

  if (!isAdmin) {
    return <p className="access-denied">❌ Access denied. Admins only.</p>;
  }

  if (loading) {
    return <p className="loading">Loading messages...</p>;
  }

  return (
    <div className="messages-container">
         <h2 className="messages-title">📩 Support Messages</h2>
      {messages.length === 0 ? (
        <p className="no-messages">No messages found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td className="message-text">{msg.message}</td>
                  <td className={`status ${msg.status}`}>{msg.status}</td>
                  <td>
                    {msg.status === "pending" && (
                      <button
                        onClick={() => resolveMessage(msg._id)}
                        className="btn btn-resolve"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(msg._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
