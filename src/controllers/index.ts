import { Request, Response } from "express";
import {
  addAppointment as addAppointmentService,
  updateAppointment as updateAppointmentService,
  removeAppointment as removeAppointmentService,
  getAppointmentBySearch as getAppointmentBySearchService,
  getAppointmentById as getAppointmentByIdService,
} from "../services";

export const addAppointment = async (req: Request, res: Response) => {
  try {
    const appointment = await addAppointmentService(req.body);
    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await updateAppointmentService(id, req.body);
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await removeAppointmentService(id);
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentByIdService(id);
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found" });
    }
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointmentBySearch = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const appointment = await getAppointmentBySearchService(req.query);
    if (!appointment || appointment.length === 0) {
      return res.status(404).json({ message: "No appointment found" });
    }
    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
