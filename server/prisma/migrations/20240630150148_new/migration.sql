-- AlterTable
ALTER TABLE "Fines" ADD COLUMN     "invoiceId" TEXT;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "invoiceId" TEXT;

-- AddForeignKey
ALTER TABLE "Fines" ADD CONSTRAINT "Fines_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
