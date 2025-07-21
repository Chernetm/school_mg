-- CreateEnum
CREATE TYPE "GradeSectionEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Audience" AS ENUM ('ALL', 'STAFF', 'STUDENTS', 'PARENTS', 'GRADE');

-- CreateEnum
CREATE TYPE "passEnum" AS ENUM ('passed', 'failed', 'incomplete');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('MODEL', 'EXAM');

-- CreateEnum
CREATE TYPE "MonthEnum" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateEnum
CREATE TYPE "FeeStatusEnum" AS ENUM ('paid', 'unpaid', 'pending');

-- CreateEnum
CREATE TYPE "staffEnum" AS ENUM ('present', 'absent', 'late');

-- CreateEnum
CREATE TYPE "attendanceStatus" AS ENUM ('present', 'absent', 'late');

-- CreateEnum
CREATE TYPE "enumSStatus" AS ENUM ('active', 'inactive', 'block');

-- CreateEnum
CREATE TYPE "enumStream" AS ENUM ('SCIENCE', 'NATURAL', 'SOCIAL');

-- CreateEnum
CREATE TYPE "passStatusEnum" AS ENUM ('passed', 'failed', 'incomplete');

-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('head', 'admin', 'registrar', 'staff', 'teacher', 'library');

-- CreateEnum
CREATE TYPE "statusEnum" AS ENUM ('active', 'inactive', 'block');

-- CreateEnum
CREATE TYPE "SemesterEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "YearEnum" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "genderEnum" AS ENUM ('MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "grade" INTEGER NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "section" TEXT NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeSection" (
    "id" SERIAL NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "capacity" INTEGER,
    "sectionId" INTEGER NOT NULL,
    "status" "GradeSectionEnum" NOT NULL,

    CONSTRAINT "GradeSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "name" INTEGER NOT NULL,
    "status" "SemesterEnum" NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Year" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "status" "YearEnum" NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "audience" "Audience" NOT NULL,
    "gradeId" INTEGER,
    "staffID" INTEGER NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" SERIAL NOT NULL,
    "staffID" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "role" "RoleEnum" DEFAULT 'staff',
    "status" "statusEnum" NOT NULL DEFAULT 'inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "staffID" INTEGER NOT NULL,
    "gradeId" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "genderEnum" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "parentID" INTEGER,
    "image" TEXT,
    "status" "enumSStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "registrationID" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "stream" "enumStream" NOT NULL DEFAULT 'SCIENCE',
    "year" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "section" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("registrationID")
);

-- CreateTable
CREATE TABLE "ResultDetail" (
    "id" SERIAL NOT NULL,
    "registrationID" INTEGER NOT NULL,
    "staffID" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "score" INTEGER,

    CONSTRAINT "ResultDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultSummary" (
    "id" SERIAL NOT NULL,
    "registrationID" INTEGER NOT NULL,
    "semester" INTEGER NOT NULL,
    "average" DOUBLE PRECISION NOT NULL,
    "passStatus" "passEnum" NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "attendanceStatus" NOT NULL,
    "studentID" TEXT NOT NULL,
    "staffID" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffAttendance" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "staffEnum" NOT NULL,
    "staffID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "StaffAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'INACTIVE',
    "type" "Type" NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "optionA" TEXT NOT NULL,
    "optionB" TEXT NOT NULL,
    "optionC" TEXT NOT NULL,
    "optionD" TEXT NOT NULL,
    "correct" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "studentID" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentSession" (
    "studentID" TEXT NOT NULL,
    "deviceFingerprint" TEXT NOT NULL,

    CONSTRAINT "StudentSession_pkey" PRIMARY KEY ("studentID")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "copies" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookBorrow" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrowDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),
    "staffID" INTEGER NOT NULL,

    CONSTRAINT "BookBorrow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fine" (
    "id" SERIAL NOT NULL,
    "borrowRecordId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Fine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fee" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "email" TEXT,
    "month" "MonthEnum" NOT NULL,
    "status" "FeeStatusEnum" NOT NULL DEFAULT 'unpaid',
    "amountPaid" DOUBLE PRECISION,
    "year" INTEGER NOT NULL DEFAULT 2025,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisciplineRecord" (
    "id" SERIAL NOT NULL,
    "studentID" TEXT NOT NULL,
    "staffID" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DisciplineRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Grade_grade_key" ON "Grade"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "Section_section_key" ON "Section"("section");

-- CreateIndex
CREATE UNIQUE INDEX "GradeSection_gradeId_sectionId_key" ON "GradeSection"("gradeId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Year_year_key" ON "Year"("year");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_staffID_key" ON "Staff"("staffID");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_username_key" ON "Staff"("username");

-- CreateIndex
CREATE INDEX "Assignment_staffID_gradeId_sectionId_idx" ON "Assignment"("staffID", "gradeId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_staffID_gradeId_sectionId_key" ON "Assignment"("staffID", "gradeId", "sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_studentID_key" ON "Student"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "ResultDetail_registrationID_subject_semester_key" ON "ResultDetail"("registrationID", "subject", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "ResultSummary_registrationID_semester_key" ON "ResultSummary"("registrationID", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_title_key" ON "Exam"("title");

-- CreateIndex
CREATE INDEX "Exam_createdBy_idx" ON "Exam"("createdBy");

-- CreateIndex
CREATE INDEX "Question_examId_idx" ON "Question"("examId");

-- CreateIndex
CREATE INDEX "Response_examId_idx" ON "Response"("examId");

-- CreateIndex
CREATE INDEX "Response_questionId_idx" ON "Response"("questionId");

-- CreateIndex
CREATE INDEX "Response_studentID_idx" ON "Response"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "Response_studentID_questionId_examId_key" ON "Response"("studentID", "questionId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentSession_studentID_key" ON "StudentSession"("studentID");

-- CreateIndex
CREATE UNIQUE INDEX "Fine_borrowRecordId_key" ON "Fine"("borrowRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Fee_studentID_month_year_key" ON "Fee"("studentID", "month", "year");

-- AddForeignKey
ALTER TABLE "GradeSection" ADD CONSTRAINT "GradeSection_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeSection" ADD CONSTRAINT "GradeSection_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("grade") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDetail" ADD CONSTRAINT "ResultDetail_registrationID_fkey" FOREIGN KEY ("registrationID") REFERENCES "Registration"("registrationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDetail" ADD CONSTRAINT "ResultDetail_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDetail" ADD CONSTRAINT "ResultDetail_semester_fkey" FOREIGN KEY ("semester") REFERENCES "Semester"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSummary" ADD CONSTRAINT "ResultSummary_registrationID_fkey" FOREIGN KEY ("registrationID") REFERENCES "Registration"("registrationID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSummary" ADD CONSTRAINT "ResultSummary_semester_fkey" FOREIGN KEY ("semester") REFERENCES "Semester"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffAttendance" ADD CONSTRAINT "StaffAttendance_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSession" ADD CONSTRAINT "StudentSession_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrow" ADD CONSTRAINT "BookBorrow_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrow" ADD CONSTRAINT "BookBorrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookBorrow" ADD CONSTRAINT "BookBorrow_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fine" ADD CONSTRAINT "Fine_borrowRecordId_fkey" FOREIGN KEY ("borrowRecordId") REFERENCES "BookBorrow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplineRecord" ADD CONSTRAINT "DisciplineRecord_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student"("studentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplineRecord" ADD CONSTRAINT "DisciplineRecord_staffID_fkey" FOREIGN KEY ("staffID") REFERENCES "Staff"("staffID") ON DELETE RESTRICT ON UPDATE CASCADE;
