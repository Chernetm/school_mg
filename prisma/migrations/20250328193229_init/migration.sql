-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staffId` INTEGER NOT NULL,
    `gradeId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `Assignment_staffId_gradeId_sectionId_idx`(`staffId`, `gradeId`, `sectionId`),
    UNIQUE INDEX `Assignment_staffId_gradeId_sectionId_key`(`staffId`, `gradeId`, `sectionId`),
    UNIQUE INDEX `Assignment_staffId_gradeId_subjectId_key`(`staffId`, `gradeId`, `subjectId`),
    UNIQUE INDEX `Assignment_staffId_gradeId_key`(`staffId`, `gradeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_staffId_fkey` FOREIGN KEY (`staffId`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
