/*
  Warnings:

  - You are about to drop the column `lesson` on the `Track` table. All the data in the column will be lost.
  - Added the required column `lessonId` to the `Track` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "lesson",
ADD COLUMN     "lessonId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Lessons";

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lesson_userId_idx" ON "Lesson"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_userId_name_key" ON "Lesson"("userId", "name");

-- CreateIndex
CREATE INDEX "Track_userId_idx" ON "Track"("userId");

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
