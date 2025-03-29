-- DropForeignKey
ALTER TABLE `assignment` DROP FOREIGN KEY `Assignment_staffID_fkey`;

-- DropIndex
DROP INDEX `Assignment_staffID_gradeId_key` ON `assignment`;

-- DropIndex
DROP INDEX `Assignment_staffID_gradeId_subjectId_key` ON `assignment`;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_staffID_fkey` FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE RESTRICT ON UPDATE CASCADE;
