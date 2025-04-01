-- CreateTable
CREATE TABLE `StudentSession` (
    `studentID` VARCHAR(191) NOT NULL,
    `deviceFingerprint` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `StudentSession_studentID_key`(`studentID`),
    PRIMARY KEY (`studentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentSession` ADD CONSTRAINT `StudentSession_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `Student`(`studentID`) ON DELETE RESTRICT ON UPDATE CASCADE;
