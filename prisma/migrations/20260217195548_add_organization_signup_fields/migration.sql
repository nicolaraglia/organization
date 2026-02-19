/*
  Warnings:

  - The values [RESTAURANTOTHER] on the enum `OrganizationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrganizationType_new" AS ENUM ('COMPANY', 'NON_PROFIT', 'PUBLIC_ADMINISTRATION', 'SCHOOL', 'HEALTHCARE', 'OTHER');
ALTER TABLE "public"."Organization" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Organization" ALTER COLUMN "type" TYPE "OrganizationType_new" USING ("type"::text::"OrganizationType_new");
ALTER TYPE "OrganizationType" RENAME TO "OrganizationType_old";
ALTER TYPE "OrganizationType_new" RENAME TO "OrganizationType";
DROP TYPE "public"."OrganizationType_old";
ALTER TABLE "Organization" ALTER COLUMN "type" SET DEFAULT 'COMPANY';
COMMIT;
