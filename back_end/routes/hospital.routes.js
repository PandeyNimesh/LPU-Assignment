import Router from "express"
import upload from "../middlewares/upload.middleware.js";
import {
    createHospital,
    getHospitalsByCity,
    deleteHospital,
    updateHospital,
    addHospitalDetails,
    getAllHospitals,
    getHospitalById
} from "../controllers/hospital.controller.js"
const router=Router()

router.route("/create").post(upload.single('image'), (req, res, next) => {
    //console.log('File:', req.file);  
    //console.log('Body:', req.body);  
    next(); 
},createHospital);

router.route("/").get(getAllHospitals);
router.route("/city").get(getHospitalsByCity)
router.route("/delete").delete(deleteHospital)
router.route("/update").put(updateHospital)
router.route("details").post(addHospitalDetails)
router.route("/details/:_id").get(getHospitalById);
export default router