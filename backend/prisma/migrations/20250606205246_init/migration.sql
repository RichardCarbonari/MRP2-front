-- CreateTable
CREATE TABLE "maintenance_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "requestedAt" DATETIME NOT NULL,
    "department" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
