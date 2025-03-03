import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditHospitalForm = () => {
  const { _id } = useParams();
  //console.log("ID",_id)
  const [formData, setFormData] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals/details/${_id}`
        );
        setFormData(response.data.data); // Set formData with fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error(
          "Error fetching hospital details:",
          error.response?.data || error.message
        );
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchHospital();
  }, [_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsUpdating(true);
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals/update?id=${_id}`,
        formData
      );
      console.log("Hospital updated:", response.data);
      setIsUpdating(false);
      toast.success("Hospital updated successfully!");
      navigate("/");
    } catch (error) {
      console.error(
        "Error updating hospital:",
        error.response?.data || error.message
      );
      toast.error("Failed to update hospital.");
      setIsUpdating(false);
    }
  };

  // Show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state if formData is still null after fetching
  if (!formData) {
    return <div>Error: Hospital data not found.</div>;
  }

  return (
    <div>
      <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Hospital</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Number of Doctors
            </label>
            <input
              type="number"
              name="numberOfDoctors"
              value={formData.numberOfDoctors}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            {isUpdating ? (
              <button
                disabled
                className="w-full bg-blue-300 text-white p-2 rounded"
              >
                updating...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update Hospital
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="w-full m-4 text-center">
        <Link to={"/"} className="bg-amber-200 p-2">
          Go To Home
        </Link>
      </div>
    </div>
  );
};

export default EditHospitalForm;
