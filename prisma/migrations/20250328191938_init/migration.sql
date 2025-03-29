-- AlterTable
ALTER TABLE `staff` ADD COLUMN `status` ENUM('active', 'inactive', 'block') NOT NULL DEFAULT 'inactive';
