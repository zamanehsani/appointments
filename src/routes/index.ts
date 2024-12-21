import express from "express";
import {
  addAppointment,
  updateAppointment,
  removeAppointment,
  getAppointmentBySearch,
  getAppointmentById,
} from "../controllers";

const router = express.Router();

router.post("/", addAppointment);
router.patch("/:id", updateAppointment);
router.delete("/:id", removeAppointment);
router.get("/search", getAppointmentBySearch);
router.get("/:id", getAppointmentById);

export default router;
