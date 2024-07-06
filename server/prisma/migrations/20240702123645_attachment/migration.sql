/*
  Warnings:

  - The `attachments` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "pages" DROP NOT NULL,
ALTER COLUMN "pages" SET DATA TYPE DECIMAL(65,30),
DROP COLUMN "attachments",
ADD COLUMN     "attachments" TEXT[];
