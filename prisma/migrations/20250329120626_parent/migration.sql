/*
  Warnings:

  - You are about to alter the column `stream` on the `registration` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `registration` MODIFY `stream` ENUM('science', 'natural', 'social') NOT NULL DEFAULT 'science';
