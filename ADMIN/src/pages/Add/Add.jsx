import React, { useState, useContext, useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext.jsx";
import { useNavigate } from "react-router-dom";

const AddArt = ({ url }) => {
  const navigate = useNavigate();
  const { token, isAdmin } = useContext(StoreContext);

  const [image, setImage] = useState(null);
  const [data, setData] = useState({ name: "", description: "", price: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token || !isAdmin) {
      toast.error("Unauthorized. Admins only.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", Number(data.price));
      formData.append("image", image);

      const response = await axios.post(`${url}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(response.data.message || "Artwork added!");
        setData({ name: "", description: "", price: "" });
        setImage(null);
      } else {
        toast.error(response.data.message || "Failed to add artwork");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!token || !isAdmin) {
      toast.error("Please login as admin");
      navigate("/");
    }
  }, [token, isAdmin, navigate]);

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        {/* Upload */}
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Preview"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        {/* Name */}
        <div className="add-art-name flex-col">
          <p>Artwork Name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Enter artwork name"
            required
          />
        </div>

        {/* Description */}
        <div className="add-art-description flex-col">
          <p>Description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Enter description"
            required
          ></textarea>
        </div>

        {/* Price */}
        <div className="add-price flex-col">
          <p>Price (₹)</p>
          <input
            onChange={onChangeHandler}
            value={data.price}
            type="number"
            name="price"
            placeholder="e.g. 500"
            required
          />
        </div>

        <button type="submit" className="add-btn">ADD ARTWORK</button>
      </form>
    </div>
  );
};

export default AddArt;
