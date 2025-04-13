/*
  Warnings:

  - Made the column `amountPaid` on table `fee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `fee` MODIFY `amountPaid` DOUBLE NOT NULL;
