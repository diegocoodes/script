-- CreateEnum
CREATE TYPE "PurchaseCategory" AS ENUM ('EQUIPMENT', 'PART', 'SUPPLY', 'SERVICE', 'OTHER');

-- CreateTable
CREATE TABLE "BusinessPurchase" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "PurchaseCategory" NOT NULL DEFAULT 'EQUIPMENT',
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalValue" DECIMAL(12,2) NOT NULL,
    "supplier" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessPurchase_purchasedAt_idx" ON "BusinessPurchase"("purchasedAt");

-- CreateIndex
CREATE INDEX "BusinessPurchase_category_purchasedAt_idx" ON "BusinessPurchase"("category", "purchasedAt");
