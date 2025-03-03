import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HospitalsByCity = () => {
  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const fetchHospitals = async () => {
    if (!city) return;
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/hospitals?city=${city}`);
      setHospitals(response.data.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [city]);

  return (
    <div>
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Hospitals in {city}</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="space-y-4">
        {hospitals.map((hospital) => (
          <div key={hospital._id} className="p-4 border rounded">
            <h3 className="text-xl font-semibold">{hospital.name}</h3>
            <p className="text-gray-600">{hospital.city}</p>
            <p className="text-gray-600">Rating: {hospital.rating}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="w-full text-center m-4">
       <Link to={"/"} className="p-2 bg-amber-200">Go To Home</Link>
    </div>
    </div>
  );
};

export default HospitalsByCity;