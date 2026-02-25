-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetToken" VARCHAR(255),
ADD COLUMN     "passwordResetTokenExpiresAt" TIMESTAMP(3);
