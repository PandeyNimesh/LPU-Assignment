import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const HomePage = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Fetch all hospitals
  const fetchHospitals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals`
      );
      setHospitals(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching hospitals:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch hospitals");
    }
  };

  // Delete a hospital
  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals/delete?_id=${_id}`
        );
        toast.success("Hospital deleted successfully");
        fetchHospitals(); // Refresh the list
      } catch (error) {
        console.error(
          "Error deleting hospital:",
          error.response?.data || error.message
        );
        toast.error("Failed to delete hospital");
      }
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  // Navigate to details page
  const handleDetails = (id) => {
    navigate(`/details/${id}`);
  };

  useEffect(() => {
    fetchHospitals();
  }, []);


  return (
    <div>
     <div className="w-full flex justify-center">
      <button onClick={()=>navigate("/city")} className="p-2 mt-5 border rounded bg-slate-400 cursor-pointer hover:bg-slate-500 text-white">Search By City</button>
     </div>
      <div>
        {loading ? (
          <div>Loading....</div>
        ) : (
          <div className="p-4">
            <div className="w-full flex justify-between px-2 p-4">
              <h1 className="text-2xl font-bold mb-4">Hospitals</h1>
              <Link
                to={"/create"}
                className="p-2 rounded-lg hover:bg-amber-400 bg-yellow-300 text-white"
              >
                Create Hospital
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="p-4 border rounded-lg cursor-pointer hover:shadow-lg hover:scale-105 duration-500"
                  onClick={() => handleDetails(hospital._id)}
                >
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h2 className="text-xl font-semibold mt-2">
                    {hospital.name}
                  </h2>
                  <p className="text-gray-600">{hospital.city}</p>
                  <p className="text-gray-600">Rating: {hospital.rating}</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleEdit(hospital._id);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleDelete(hospital._id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Toaster />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
