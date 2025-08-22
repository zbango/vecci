-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "type" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "reference" TEXT,
    "headquartersId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitUserAssignment" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "communityUserId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UnitUserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitAdditionalSpace" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "area" INTEGER NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UnitAdditionalSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitAdditionalSpaceUserAssignment" (
    "id" TEXT NOT NULL,
    "additionalSpaceId" TEXT NOT NULL,
    "communityUserId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UnitAdditionalSpaceUserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Unit_type_idx" ON "Unit"("type");

-- CreateIndex
CREATE INDEX "Unit_identification_idx" ON "Unit"("identification");

-- CreateIndex
CREATE INDEX "Unit_headquartersId_idx" ON "Unit"("headquartersId");

-- CreateIndex
CREATE INDEX "Unit_createdByUserId_idx" ON "Unit"("createdByUserId");

-- CreateIndex
CREATE INDEX "UnitUserAssignment_unitId_idx" ON "UnitUserAssignment"("unitId");

-- CreateIndex
CREATE INDEX "UnitUserAssignment_communityUserId_idx" ON "UnitUserAssignment"("communityUserId");

-- CreateIndex
CREATE INDEX "UnitUserAssignment_role_idx" ON "UnitUserAssignment"("role");

-- CreateIndex
CREATE INDEX "UnitUserAssignment_createdByUserId_idx" ON "UnitUserAssignment"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitUserAssignment_unitId_communityUserId_role_key" ON "UnitUserAssignment"("unitId", "communityUserId", "role");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpace_unitId_idx" ON "UnitAdditionalSpace"("unitId");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpace_createdByUserId_idx" ON "UnitAdditionalSpace"("createdByUserId");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpaceUserAssignment_additionalSpaceId_idx" ON "UnitAdditionalSpaceUserAssignment"("additionalSpaceId");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpaceUserAssignment_communityUserId_idx" ON "UnitAdditionalSpaceUserAssignment"("communityUserId");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpaceUserAssignment_role_idx" ON "UnitAdditionalSpaceUserAssignment"("role");

-- CreateIndex
CREATE INDEX "UnitAdditionalSpaceUserAssignment_createdByUserId_idx" ON "UnitAdditionalSpaceUserAssignment"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "UnitAdditionalSpaceUserAssignment_additionalSpaceId_communi_key" ON "UnitAdditionalSpaceUserAssignment"("additionalSpaceId", "communityUserId", "role");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_headquartersId_fkey" FOREIGN KEY ("headquartersId") REFERENCES "Headquarters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitUserAssignment" ADD CONSTRAINT "UnitUserAssignment_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitUserAssignment" ADD CONSTRAINT "UnitUserAssignment_communityUserId_fkey" FOREIGN KEY ("communityUserId") REFERENCES "CommunityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitUserAssignment" ADD CONSTRAINT "UnitUserAssignment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAdditionalSpace" ADD CONSTRAINT "UnitAdditionalSpace_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAdditionalSpace" ADD CONSTRAINT "UnitAdditionalSpace_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAdditionalSpaceUserAssignment" ADD CONSTRAINT "UnitAdditionalSpaceUserAssignment_additionalSpaceId_fkey" FOREIGN KEY ("additionalSpaceId") REFERENCES "UnitAdditionalSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAdditionalSpaceUserAssignment" ADD CONSTRAINT "UnitAdditionalSpaceUserAssignment_communityUserId_fkey" FOREIGN KEY ("communityUserId") REFERENCES "CommunityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitAdditionalSpaceUserAssignment" ADD CONSTRAINT "UnitAdditionalSpaceUserAssignment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
