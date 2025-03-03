import { Router } from "express";
import {signUp,login,logOut} from "../controllers/user.controller.js"
import {authorizedUser} from "../middlewares/verifyJWT.js"
const router=Router()

router.post("/register",signUp);
router.post("/login", login);
router.route("/log_out").post(authorizedUser,logOut)

export {router} 