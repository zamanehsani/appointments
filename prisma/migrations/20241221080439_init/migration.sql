-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "patient" TEXT NOT NULL,
    "madeby" TEXT,
    "department" TEXT,
    "services" TEXT,
    "note" TEXT,

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);
