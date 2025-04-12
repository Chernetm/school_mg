const { prisma } = require("@/utils/prisma");

// GET - Fetch all subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany();
    return Response.json(subjects, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed to fetch subjects." }, { status: 500 });
  }
}

// POST - Create a new subject
export async function POST(req) {
  try {
    // Parse incoming JSON request body
    const { name } = await req.json(); // Ensure we parse the body correctly
    console.log(name); // Debug: check what we get from the request body
    
    // Create the new subject in the database
    const subject = await prisma.subject.create({ data: { name } });
    
    // Return the created subject
    return Response.json(subject, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Subject creation failed." }, { status: 500 });
  }
}




