-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grade` INTEGER NOT NULL,

    UNIQUE INDEX `Grade_grade_key`(`grade`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `section` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Section_section_key`(`section`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GradeSection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `gradeId` INTEGER NOT NULL,
    `sectionId` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,

    UNIQUE INDEX `GradeSection_gradeId_sectionId_key`(`gradeId`, `sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Year` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `status` ENUM('active', 'inactive') NOT NULL,

    UNIQUE INDEX `Year_year_key`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GradeSection` ADD CONSTRAINT `GradeSection_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GradeSection` ADD CONSTRAINT `GradeSection_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
