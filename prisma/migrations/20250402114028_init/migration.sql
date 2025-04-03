-- AlterTable
ALTER TABLE `registration` ADD COLUMN `status` ENUM('passed', 'failed', 'incomplete', 'undetermined') NOT NULL DEFAULT 'undetermined',
    MODIFY `section` VARCHAR(191) NULL;
