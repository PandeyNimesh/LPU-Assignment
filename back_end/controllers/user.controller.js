import { User } from "../models/user.model.js";
import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessToken=async(userId)=>{
    try {
        const user=await User.findById(userId)
        //console.log("User:",user)
        const accessToken=user.generateAccessToken()
        //console.log("accessToken:",accessToken)
        await user.save({ validateBeforeSave: false})
        return {accessToken}
    } catch (error) {
        console.log(error)
        throw new ApiError(500,"error while generating accessToken and refreshToken")
    }
}

const signUp=AsyncHandler(async(req,res,)=>{
    const {userName,email,password}=req.body
    console.log(userName,email,password)
    if(!userName){
        throw new ApiError(401,"userName is required")
    }
    if(!email){
        throw new ApiError(401,"email is required")
    }
    if(!password){
        throw new ApiError(404,"password is required")
    }

    const isUserExist=await User.findOne({
        email,
    })

    if(isUserExist){
        throw new ApiError(500,"user already exist")
    }

    const user=await User.create({
        userName,
        email,
        password,
    })
   
    if(!user){
        throw new ApiError(404,"user not created")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,user,"user created successfully"))
    
})

const login=AsyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!(email && password)){
        throw new ApiError(402,"require fields")
    }
    const user=await User.findOne({email})
    // console.log("User:",user)
    if(!user){
        throw new ApiError(404,"user not exist")
    }

    //console.log("user Id",user._id)
    
    const isPasswordValid=await user.isPasswordCorrect(password)
    //console.log("isPasswordvalid:",isPasswordValid)
    if(!isPasswordValid){
        throw new ApiError(500,"password of email is not valid please check!")
    }

    const {accessToken}=await generateAccessToken(user._id)
   // console.log("accessToken:",accessToken)
   
    
    const loggedInUser=await User.findById(user._id).select('-password -refreshToken')
    
    const options = {
        httpOnly: true,                   
        secure: process.env.NODE_ENV === 'production',  
        // sameSite: 'None',                 
      };

    return res
    .status(200)
    .cookie("AccessToken",accessToken,{ ...options, maxAge: 604800000 })
    .json(new ApiResponse(200,{user:loggedInUser,accessToken},"user loggedIn successfully"))

})

// logOut user
const logOut=AsyncHandler(async(req,res)=>{
    //console.log("_id",req.user._id)
    await User.findByIdAndUpdate(req.user._id,
       {
          $set:{
            refreshToken:undefined
           }
       }
    ,{new:true})

    const options={
       httpOnly:true,
       secure:true
    }
    return res
    .status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(new ApiResponse(200,{},"you are logout successfully"))
})

export {signUp,login,logOut}
