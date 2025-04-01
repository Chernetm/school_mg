/*
  Warnings:

  - The primary key for the `registration` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `registration` table. All the data in the column will be lost.
  - Added the required column `registrationID` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `resultdetail` DROP FOREIGN KEY `ResultDetail_registrationID_fkey`;

-- AlterTable
ALTER TABLE `registration` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `registrationID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`registrationID`);

-- AddForeignKey
ALTER TABLE `ResultDetail` ADD CONSTRAINT `ResultDetail_registrationID_fkey` FOREIGN KEY (`registrationID`) REFERENCES `Registration`(`registrationID`) ON DELETE RESTRICT ON UPDATE CASCADE;
