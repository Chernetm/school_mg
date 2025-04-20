const { prisma } = require("@/utils/prisma");
import { getStaffIDFromToken } from "@/utils/auth";
import { NextResponse } from "next/server";
 
 export async function POST(req) {
  try {
    

    const staffID = await getStaffIDFromToken();
    if (!staffID) {
      console.log("❌ Staff ID is required.");
      return NextResponse.json({ message: "Staff ID is required" }, { status: 401 });
    }
    console.log("👤 Staff ID:", staffID);

    // Parse request body
    const body = await req.json();
    console.log("📝 Request body:", body);

    const { examTitle, examDescription, startTime, endTime, questions } = body;

    if (!examTitle || !startTime || !endTime || !Array.isArray(questions)) {
      console.log("❌ Validation failed: Missing fields.");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("✅ Validation passed, creating exam...");

    // Step 1: Create exam
    const exam = await prisma.exam.create({
      data: {
        title: examTitle,
        description: examDescription,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        createdBy: parseInt(staffID),
      },
    });

    console.log("🎉 Exam created:", exam);

    // Step 2: Insert multiple questions
    const createdQuestions = await prisma.question.createMany({
      data: questions.map((q) => ({
        examId: exam.id,
        content: q.content,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correct: q.correct,
      })),
    });

    console.log("✅ Questions added:", createdQuestions);

    return NextResponse.json(
      {
        message: "Exam and questions added successfully",
        exam,
        totalQuestions: createdQuestions.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error creating exam:", error);
    return NextResponse.json({ message: "Failed to create exam" }, { status: 500 });
  }
}