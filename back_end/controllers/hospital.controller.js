import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { Hospital } from "../models/hospital.model.js"

const createHospital=AsyncHandler(async(req,res)=>{
    const { name, city, speciality, rating } = req.body;
    if (!name || !city || !speciality || !rating) {
        throw new ApiError(404,"all fileds are required")
    }

    if (!req.file) {
      throw new ApiError(400, "Image file is required");
    }

      const hospital = new Hospital({
        name,
        city,
        image:req.file ? req.file.path: '',
        speciality,
        rating,
      });

      await hospital.save()

      if(!hospital){
        throw new ApiError(500,"hospital not created")
      }

    return res
    .json(new ApiResponse(200,hospital,"hospital created successfully"))
    .status(200)
      
})


const getHospitalsByCity = AsyncHandler(async (req, res) => {
  // Extract the city from the query parameters
  const { city } = req.query;
  console.log("city",city)

  if (!city) {
    throw new ApiError(400, "City parameter is required");
  }

  const hospitals = await Hospital.find({ city });

  // Check if hospitals were found
  if (!hospitals || hospitals.length === 0) {
    throw new ApiError(404, `No hospitals found in ${city}`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, hospitals, `Hospitals in ${city} fetched successfully`));
});

const deleteHospital = AsyncHandler(async (req, res) => {
  // Extract the hospital ID from the query parameters
  const { _id } = req.query;
  if (!_id) {
    throw new ApiError(400, "Hospital ID is required");
  }
  const deletedHospital = await Hospital.findByIdAndDelete(_id);
  if (!deletedHospital) {
    throw new ApiError(404, "Hospital not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deletedHospital, "Hospital deleted successfully"));
});

const updateHospital = AsyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Hospital ID is required");
  }

  const { name, city, image, speciality, rating } = req.body;

  if (!name && !city && !image && !speciality && !rating) {
    throw new ApiError(400, "At least one field is required for update");
  }

  const updateFields = {};
  if (name) updateFields.name = name;
  if (city) updateFields.city = city;
  if (image) updateFields.image = image;
  if (speciality) updateFields.speciality = speciality;
  if (rating) updateFields.rating = rating;

  const updatedHospital = await Hospital.findByIdAndUpdate(
    id,
    updateFields,
    { new: true }
  );

  if (!updatedHospital) {
    throw new ApiError(404, "Hospital not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedHospital, "Hospital updated successfully"));
});

const addHospitalDetails = AsyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) {
    throw new ApiError(400, "Hospital ID is required");
  }

  // Extract the details from the request body
  const { description, images, numberOfDoctors,numberOfDepartments } = req.body;

  // Validate that at least one field is provided
  if (!description && !images && !numberOfDoctors && !numberOfDepartments) {
    throw new ApiError(400, "At least one field is required");
  }

  // Create an update object with only the provided fields
  const updateFields = {};
  if (description) updateFields.description = description;
  if (images) updateFields.images = images;
  if (numberOfDoctors) updateFields.numberOfDoctors = numberOfDoctors;
  if(numberOfDepartments) updateFields.numberOfDepartments=numberOfDepartments;

  // Find and update the hospital
  const updatedHospital = await Hospital.findByIdAndUpdate(
    _id,
    updateFields,
    { new: true } // Return the updated document
  );

  // Check if the hospital was found and updated
  if (!updatedHospital) {
    throw new ApiError(404, "Hospital not found");
  }

  // Return success response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedHospital, "Hospital details added successfully"));
});

const getAllHospitals = AsyncHandler(async (req, res) => {
  const hospitals = await Hospital.find();
  return res
    .status(200)
    .json(new ApiResponse(200, hospitals, "Hospitals fetched successfully"));
});

const getHospitalById = AsyncHandler(async (req, res) => {
  const { _id } = req.params;
  console.log("id",_id)
  // Validate the ID
  if (!_id) {
    throw new ApiError(400, "Hospital ID is required");
  }

  // Fetch the hospital by ID
  const hospital = await Hospital.findById(_id);

  // Check if the hospital exists
  if (!hospital) {
    throw new ApiError(404, "Hospital not found");
  }

  // Return the hospital details
  return res
    .status(200)
    .json(new ApiResponse(200, hospital, "Hospital details fetched successfully"));
});

export {
  createHospital,
  getHospitalsByCity,
  deleteHospital,
  updateHospital,
  addHospitalDetails,
  getAllHospitals,
  getHospitalById
}