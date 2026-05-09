-- CreateTable
CREATE TABLE "experiences" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "durationHours" INTEGER NOT NULL,
    "images" TEXT[],
    "meetingPoint" TEXT NOT NULL,
    "includes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guideId" TEXT NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guide_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
