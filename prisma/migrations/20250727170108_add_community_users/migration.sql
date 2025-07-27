-- CreateTable
CREATE TABLE "CommunityUser" (
    "id" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "avatar" TEXT,
    "firstName" TEXT NOT NULL,
    "secondName" TEXT,
    "firstLastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "nationality" TEXT NOT NULL,
    "identificationType" TEXT NOT NULL,
    "identificationNumber" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "mobilePhone" TEXT NOT NULL,
    "homePhone" TEXT,
    "residentRole" TEXT,
    "adminRole" TEXT NOT NULL DEFAULT 'Usuario',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CommunityUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityUser_identificationNumber_idx" ON "CommunityUser"("identificationNumber");

-- CreateIndex
CREATE INDEX "CommunityUser_mobilePhone_idx" ON "CommunityUser"("mobilePhone");

-- CreateIndex
CREATE INDEX "CommunityUser_residentRole_idx" ON "CommunityUser"("residentRole");

-- CreateIndex
CREATE INDEX "CommunityUser_adminRole_idx" ON "CommunityUser"("adminRole");

-- CreateIndex
CREATE INDEX "CommunityUser_createdByUserId_idx" ON "CommunityUser"("createdByUserId");

-- CreateIndex
CREATE INDEX "CommunityUser_isTrashed_idx" ON "CommunityUser"("isTrashed");

-- AddForeignKey
ALTER TABLE "CommunityUser" ADD CONSTRAINT "CommunityUser_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
