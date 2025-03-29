/*
  Warnings:

  - Made the column `image` on table `staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `staff` MODIFY `image` VARCHAR(191) NOT NULL;
