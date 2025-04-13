-- CreateTable
CREATE TABLE `Announcement` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `audience` ENUM('ALL', 'STAFF', 'STUDENTS', 'PARENTS', 'GRADE') NOT NULL,
    `gradeId` INTEGER NULL,
    `staffID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `grade` VARCHAR(191) NOT NULL,
    `copies` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookBorrow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentID` VARCHAR(191) NOT NULL,
    `bookId` INTEGER NOT NULL,
    `borrowDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `returnDate` DATETIME(3) NULL,
    `staffID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentID` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `month` ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December') NOT NULL,
    `status` ENUM('paid', 'unpaid', 'pending') NOT NULL DEFAULT 'unpaid',
    `amountPaid` DOUBLE NULL,
    `year` INTEGER NOT NULL DEFAULT 2025,
    `paymentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Fee_studentID_month_year_key`(`studentID`, `month`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`grade`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_staffID_fkey` FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_staffID_fkey` FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `Student`(`studentID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fee` ADD CONSTRAINT `Fee_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `Student`(`studentID`) ON DELETE RESTRICT ON UPDATE CASCADE;
