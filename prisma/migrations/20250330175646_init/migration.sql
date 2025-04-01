-- CreateTable
CREATE TABLE `ResultDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `registrationID` INTEGER NOT NULL,
    `staffID` INTEGER NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `score` INTEGER NULL,

    UNIQUE INDEX `ResultDetail_registrationID_subject_key`(`registrationID`, `subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResultDetail` ADD CONSTRAINT `ResultDetail_registrationID_fkey` FOREIGN KEY (`registrationID`) REFERENCES `Registration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ResultDetail` ADD CONSTRAINT `ResultDetail_staffID_fkey` FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE RESTRICT ON UPDATE CASCADE;
