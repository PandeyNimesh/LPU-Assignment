import mongoose from "mongoose";

const hospitalSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      speciality: {
        type: [String], // Array of strings
        required: true
      },
      rating: {
        type: Number,
      },
      description: { 
        type: String, 
        default: "" 
      }, 
     images: {
       type: [String], 
       default: [] 
      },
     numberOfDoctors: {
       type: Number, 
      },
      numberOfDepartments:{
        type:Number,
      }
},{timestamps:true})

export const Hospital=mongoose.model("Hospital",hospitalSchema)