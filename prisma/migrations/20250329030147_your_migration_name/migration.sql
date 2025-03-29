/*
  Warnings:

  - You are about to drop the column `staffId` on the `assignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[staffID,gradeId,sectionId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staffID,gradeId,subjectId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staffID,gradeId]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `staffID` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_staffId_fkey`;

-- DropIndex
DROP INDEX `Assignment_staffId_gradeId_key` ON `assignment`;

-- DropIndex
DROP INDEX `Assignment_staffId_gradeId_sectionId_idx` ON `assignment`;

-- DropIndex
DROP INDEX `Assignment_staffId_gradeId_sectionId_key` ON `assignment`;

-- DropIndex
DROP INDEX `Assignment_staffId_gradeId_subjectId_key` ON `assignment`;

-- AlterTable
ALTER TABLE `assignment` DROP COLUMN `staffId`,
    ADD COLUMN `staffID` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Assignment_staffID_gradeId_sectionId_idx` ON `Assignment`(`staffID`, `gradeId`, `sectionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Assignment_staffID_gradeId_sectionId_key` ON `Assignment`(`staffID`, `gradeId`, `sectionId`);

-- CreateIndex
CREATE UNIQUE INDEX `Assignment_staffID_gradeId_subjectId_key` ON `Assignment`(`staffID`, `gradeId`, `subjectId`);

-- CreateIndex
CREATE UNIQUE INDEX `Assignment_staffID_gradeId_key` ON `Assignment`(`staffID`, `gradeId`);

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_staffID_fkey` FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE RESTRICT ON UPDATE CASCADE;
