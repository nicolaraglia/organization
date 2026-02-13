-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM (
  'COMPANY',
  'NON_PROFIT',
  'PUBLIC_ADMINISTRATION',
  'SCHOOL',
  'HEALTHCARE',
  'RESTAURANT'
  'OTHER'
);

-- AlterTable
ALTER TABLE "Organization"
ADD COLUMN "type" "OrganizationType" NOT NULL DEFAULT 'COMPANY';
