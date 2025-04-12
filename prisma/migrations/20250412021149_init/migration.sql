/*
  Warnings:

  - You are about to drop the column `userType` on the `staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `staff` DROP COLUMN `userType`,
    MODIFY `role` ENUM('head', 'admin', 'register', 'staff', 'teacher') NULL DEFAULT 'staff';
