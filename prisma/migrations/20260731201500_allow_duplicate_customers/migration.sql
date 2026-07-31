-- Allow returning customers to be registered again while keeping lookup fast.
DROP INDEX IF EXISTS "Customer_document_key";

CREATE INDEX "Customer_document_idx" ON "Customer"("document");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
