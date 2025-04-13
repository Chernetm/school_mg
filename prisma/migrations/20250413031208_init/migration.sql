/*
  Warnings:

  - Added the required column `grade` to the `Fee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fee` ADD COLUMN `grade` INTEGER NOT NULL;
