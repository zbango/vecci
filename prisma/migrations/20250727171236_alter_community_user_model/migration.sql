/*
  Warnings:

  - Added the required column `email` to the `CommunityUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CommunityUser_createdByUserId_idx";

-- DropIndex
DROP INDEX "CommunityUser_isTrashed_idx";

-- DropIndex
DROP INDEX "CommunityUser_mobilePhone_idx";

-- AlterTable
ALTER TABLE "CommunityUser" ADD COLUMN     "email" TEXT NOT NULL,
ALTER COLUMN "adminRole" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "CommunityUser_email_idx" ON "CommunityUser"("email");
