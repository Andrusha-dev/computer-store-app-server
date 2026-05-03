-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PROCESSORS', 'MEMORY', 'STORAGE', 'GRAPHIC_CARDS', 'MOTHERBOARDS', 'POWER_SUPPLIES');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "imgUrls" TEXT[],
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "category" "Category" NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");
