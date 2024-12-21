// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import appointmentRoutes from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Appointment service running");
});

app.use("/appointments", appointmentRoutes);

app.listen(port, () => {
  console.log(`Appointment service running on port ${port}`);
});
