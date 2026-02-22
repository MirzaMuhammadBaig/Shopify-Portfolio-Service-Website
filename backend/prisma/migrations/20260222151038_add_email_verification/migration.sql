-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT DEFAULT 'local',
ADD COLUMN     "verification_token" TEXT;
