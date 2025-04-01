/*
  Warnings:

  - A unique constraint covering the columns `[semester]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterID` to the `ResultDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `resultdetail` ADD COLUMN `semesterID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Semester_semester_key` ON `Semester`(`semester`);

-- AddForeignKey
ALTER TABLE `ResultDetail` ADD CONSTRAINT `ResultDetail_semesterID_fkey` FOREIGN KEY (`semesterID`) REFERENCES `Semester`(`semester`) ON DELETE RESTRICT ON UPDATE CASCADE;
