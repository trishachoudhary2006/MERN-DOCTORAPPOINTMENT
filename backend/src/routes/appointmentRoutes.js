import express from "express"
import { cancelAppointment, createAppointment,completeAppointment, deleteAppointment, getAllAppointments, getAppointmentByID, updateAppointment,getWaitlist} from "../controllers/appointmentController.js";




const router = express.Router();
router.get("/" , getAllAppointments)
router.get("/waitlist", getWaitlist);
router.put("/cancel/:id", cancelAppointment)
router.put("/complete/:id", completeAppointment)
router.get("/:id", getAppointmentByID)
router.post("/" , createAppointment)
router.put("/:id",updateAppointment)
router.delete("/:id", deleteAppointment)



export default router


