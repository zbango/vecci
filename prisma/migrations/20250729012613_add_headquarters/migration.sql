-- CreateTable
CREATE TABLE "Headquarters" (
    "id" TEXT NOT NULL,
    "avatar" TEXT,
    "type" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "reference" TEXT,
    "mobilePhone" TEXT NOT NULL,
    "homePhone" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Headquarters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeadquartersUserAssignment" (
    "id" TEXT NOT NULL,
    "headquartersId" TEXT NOT NULL,
    "communityUserId" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isTrashed" BOOLEAN NOT NULL DEFAULT false,
    "createdByUserId" TEXT,
    "isProtected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HeadquartersUserAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Headquarters_type_idx" ON "Headquarters"("type");

-- CreateIndex
CREATE INDEX "Headquarters_identification_idx" ON "Headquarters"("identification");

-- CreateIndex
CREATE INDEX "Headquarters_email_idx" ON "Headquarters"("email");

-- CreateIndex
CREATE INDEX "Headquarters_createdByUserId_idx" ON "Headquarters"("createdByUserId");

-- CreateIndex
CREATE INDEX "HeadquartersUserAssignment_headquartersId_idx" ON "HeadquartersUserAssignment"("headquartersId");

-- CreateIndex
CREATE INDEX "HeadquartersUserAssignment_communityUserId_idx" ON "HeadquartersUserAssignment"("communityUserId");

-- CreateIndex
CREATE INDEX "HeadquartersUserAssignment_position_idx" ON "HeadquartersUserAssignment"("position");

-- CreateIndex
CREATE INDEX "HeadquartersUserAssignment_createdByUserId_idx" ON "HeadquartersUserAssignment"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "HeadquartersUserAssignment_headquartersId_communityUserId_p_key" ON "HeadquartersUserAssignment"("headquartersId", "communityUserId", "position");

-- AddForeignKey
ALTER TABLE "Headquarters" ADD CONSTRAINT "Headquarters_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadquartersUserAssignment" ADD CONSTRAINT "HeadquartersUserAssignment_headquartersId_fkey" FOREIGN KEY ("headquartersId") REFERENCES "Headquarters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadquartersUserAssignment" ADD CONSTRAINT "HeadquartersUserAssignment_communityUserId_fkey" FOREIGN KEY ("communityUserId") REFERENCES "CommunityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HeadquartersUserAssignment" ADD CONSTRAINT "HeadquartersUserAssignment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
