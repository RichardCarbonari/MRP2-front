-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_maintenance_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipment" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "requestedAt" DATETIME NOT NULL,
    "department" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "maintenance_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_maintenance_requests" ("department", "description", "equipment", "id", "priority", "requestedAt", "requestedBy", "status", "updatedAt") SELECT "department", "description", "equipment", "id", "priority", "requestedAt", "requestedBy", "status", "updatedAt" FROM "maintenance_requests";
DROP TABLE "maintenance_requests";
ALTER TABLE "new_maintenance_requests" RENAME TO "maintenance_requests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
