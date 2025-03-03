import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const HospitalCreationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    speciality: [],
    rating: "",
  });
  const [imageFile, setImageFile] = useState(null); // State to store the image file
  const [isCreading, setIsCreating] = useState(false);
  const navigation=useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecialityChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({ ...formData, speciality: selectedOptions });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the selected file
    }
  };

  const handleSubmit = async (e) => {
    setIsCreating(true);
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.city ||
      !formData.speciality ||
      !formData.rating ||
      !imageFile
    ) {
      toast.error("All fields are required");
      return;
    }

    // Create FormData object
    const data = new FormData();
    data.append("name", formData.name);
    data.append("city", formData.city);
    data.append("speciality", JSON.stringify(formData.speciality)); // Convert array to JSON string
    data.append("rating", formData.rating);
    data.append("image", imageFile); // Append the image file

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals/create`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );
      console.log("Hospital created:", response.data);
      toast.success("Hospital created successfully");
      setIsCreating(false);
      navigation("/")
    } catch (error) {
      console.error(
        "Error creating hospital:",
        error.response?.data || error.message
      );
      toast.error("Failed to create hospital");
      setIsCreating(false);
    }
  };

  return (
    <div>
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Hospital</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
              accept="image/*" // Accept only image files
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Specialities
            </label>
            <select
              name="speciality"
              multiple
              value={formData.speciality}
              onChange={handleSpecialityChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="Pediatrics">Pediatrics</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              max="5"
              step="0.1"
              required
            />
          </div>
          <div>
            {isCreading ? (
              <button
                disabled
                className="w-full bg-blue-300 text-white p-2 rounded"
              >
                creating...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
              >
                Add Hospital
              </button>
            )}
          </div>
          <Toaster />
        </form>
      </div>
      <div className="w-full text-center m-4">
        <Link to={"/"} className="bg-amber-200 p-2">
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default HospitalCreationForm;
