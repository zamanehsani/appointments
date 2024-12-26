import { PrismaClient } from "@prisma/client";
import rabbitmq from "../utils/rabbitmt";

const prisma = new PrismaClient();

export const addAppointment = async (data: any) => {
  try {
    // Assuming the date field is named "birthDate"
    if (data.date) {
      console.log("let convert the date format into the standard format...");
      const dateInstance = new Date(data.date as string);
      dateInstance.setHours(0, 0, 0, 0); //Set time to the beginning of the day
      data.date = dateInstance;
    }

    const appointment = await prisma.appointments.create({
      data,
    });
    await rabbitmq.publish("appointments", "appointment.created", appointment);
    console.log("Appointment created successfully and published to RabbitMQ");
    return appointment;
  } catch (error) {
    console.error("Error creating appointmnet:", error);
    throw new Error("Error creating appointment");
  }
};

export const updateAppointment = async (id: string, data: any) => {
  /**
   * add proper validation of id and data not being present.
   * or date and or time is not the right format.
   * or id is not found
   * then send proper error message to the front
   *
   */
  try {
    const appointment = await prisma.appointments.update({
      where: { id },
      data,
    });
    await rabbitmq.publish("appointments", "appointment.updated", appointment);
    return appointment;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw new Error("Error updating appointment");
  }
};

export const removeAppointment = async (id: string) => {
  // add the proper validate. if the id is not provided, or the id is not valide or not found in the
  // DB then send proper error message to the front.
  try {
    const appointment = await prisma.appointments.delete({
      where: { id },
    });
    await rabbitmq.publish("appointments", "appointment.deleted", appointment);
    return appointment;
  } catch (error) {
    console.error("Error removing appointment:", error);
    throw new Error("Error removing appointment");
  }
};

export const getAppointmentById = async (id: string) => {
  /**
   * as the same, valide the request
   */
  try {
    const appointment = await prisma.appointments.findUnique({
      where: { id },
    });
    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw new Error("Error fetching appointment");
  }
};

export const getAppointmentBySearch = async (query: any) => {
  try {
    const { date, time, patient, department, services } = query;

    const whereClause: any = {};

    if (!date && !time && !patient && !department && !services) {
      throw new Error("Please provide at least one search parameter.");
    }

    if (date) {
      try {
        const datei = new Date(date as string);
        const startOfDay = new Date(datei);
        const endOfDay = new Date(datei);
        startOfDay.setUTCHours(0, 0, 0, 0); // Set UTC time to the start of the day
        endOfDay.setUTCHours(23, 59, 59, 999); // Set UTC time to the end of the day
        whereClause.date = {
          gte: startOfDay,
          lte: endOfDay,
        };
      } catch (error) {
        throw new Error("Invalid date format for date.");
      }
    }

    if (time) {
      whereClause.time = { contains: time as string, mode: "insensitive" };
    }
    if (patient) {
      whereClause.patient = {
        contains: patient as string,
        mode: "insensitive",
      };
    }
    if (department) {
      whereClause.department = {
        contains: department as string,
        mode: "insensitive",
      };
    }
    if (services) {
      whereClause.services = {
        contains: services as string,
        mode: "insensitive",
      };
    }

    const appointments = await prisma.appointments.findMany({
      where: whereClause,
    });

    if (!appointments || appointments.length === 0) {
      throw new Error("No appointments found");
    }

    return appointments;
  } catch (error: any) {
    console.error("Error searching appointment:", error);
    throw new Error(error.message);
  }
};
