-- CreateEnum
CREATE TYPE "ResortStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "resorts" DROP CONSTRAINT "resorts_ownerId_fkey";

-- AlterTable
ALTER TABLE "resorts" ADD COLUMN     "category" TEXT,
ADD COLUMN     "houseRules" TEXT[],
ADD COLUMN     "mealPackages" JSONB,
ADD COLUMN     "status" "ResortStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "maxNights" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "minNights" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "room_price_overrides" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "minNights" INTEGER,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "room_price_overrides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_blockings" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "room_blockings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION,
    "flatAmount" DOUBLE PRECISION,
    "minBookingAmt" DOUBLE PRECISION,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isEarlyBird" BOOLEAN NOT NULL DEFAULT false,
    "minDaysInAdvance" INTEGER,
    "isLastMinute" BOOLEAN NOT NULL DEFAULT false,
    "maxDaysInAdvance" INTEGER,
    "resortId" TEXT NOT NULL,

    CONSTRAINT "discount_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "resortId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resort_owners" (
    "id" TEXT NOT NULL,
    "businessName" TEXT,
    "gstNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "resort_owners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_price_overrides_roomId_date_key" ON "room_price_overrides"("roomId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "room_blockings_roomId_date_key" ON "room_blockings"("roomId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "discount_codes_code_key" ON "discount_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "resort_owners_userId_key" ON "resort_owners"("userId");

-- AddForeignKey
ALTER TABLE "resorts" ADD CONSTRAINT "resorts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "resort_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_price_overrides" ADD CONSTRAINT "room_price_overrides_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_blockings" ADD CONSTRAINT "room_blockings_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "resorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_resortId_fkey" FOREIGN KEY ("resortId") REFERENCES "resorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resort_owners" ADD CONSTRAINT "resort_owners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
