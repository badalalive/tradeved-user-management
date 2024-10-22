/*
  Warnings:

  - You are about to drop the column `registrationStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registrationStatus",
ADD COLUMN     "registration_status" "UserRegisterStatus" DEFAULT 'PENDING';
