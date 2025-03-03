import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const HospitalDetails = () => {
  const { _id } = useParams(); // Get the hospital ID from the URL
  //console.log("id", _id);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch hospital details
  const fetchHospital = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/hospitals/details/${_id}`
      );
      setHospital(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching hospital details:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch hospital details");
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchHospital();
  }, [_id]);

  // Show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error state if hospital data is not found
  if (!hospital) {
    return <div>Error: Hospital not found.</div>;
  }

  return (
    <div>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{hospital.name}</h2>
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-64 object-cover rounded"
        />
        <p className="text-gray-600 mt-2">{hospital.city}</p>
        <p className="text-gray-600">Rating: {hospital.rating}</p>
        <p className="text-gray-600">
          Specialities: {hospital.speciality.join(", ")}
        </p>
        <p className="text-gray-600">Description: {hospital.description}</p>
        <p className="text-gray-600">
          Number of Doctors: {hospital.numberOfDoctors}
        </p>
        <Toaster />
      </div>
      <div className="w-full text-center m-4">
        <Link to={"/"} className="p-2 bg-amber-200">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default HospitalDetails;
