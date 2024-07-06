/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CompletedJobs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompletedJobs" DROP CONSTRAINT "CompletedJobs_freelancerId_fkey";

-- DropForeignKey
ALTER TABLE "CompletedJobs" DROP CONSTRAINT "CompletedJobs_orderId_fkey";

-- AlterTable
ALTER TABLE "CancelledJobs" ALTER COLUMN "attachments" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Fines" ALTER COLUMN "reason" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "service" DROP NOT NULL,
ALTER COLUMN "sources" DROP NOT NULL,
ALTER COLUMN "citation" DROP NOT NULL,
ALTER COLUMN "additionalNotes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
DROP COLUMN "tokenExp",
ALTER COLUMN "profilePic" DROP NOT NULL;

-- DropTable
DROP TABLE "CompletedJobs";

-- CreateTable
CREATE TABLE "SubmittedJobs" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "freelancerId" TEXT NOT NULL,
    "file_Path" TEXT NOT NULL,
    "file_mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SubmittedJobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmittedJobs_freelancerId_status_createdAt_idx" ON "SubmittedJobs"("freelancerId", "status", "createdAt");

-- AddForeignKey
ALTER TABLE "SubmittedJobs" ADD CONSTRAINT "SubmittedJobs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmittedJobs" ADD CONSTRAINT "SubmittedJobs_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
