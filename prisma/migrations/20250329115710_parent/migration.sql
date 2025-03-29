-- AlterTable
ALTER TABLE `student` MODIFY `status` ENUM('active', 'inactive', 'block') NOT NULL DEFAULT 'active';
