const { prisma } = require("@/utils/prisma");


export async function DELETE(req, { params }) {
  try {
    const { id } = params; // Correct way to destructure params

    // Make sure the ID is a valid number
    if (isNaN(id)) {
      return Response.json({ error: "Invalid ID." }, { status: 400 });
    }

    // Delete the subject by ID
    await prisma.subject.delete({ where: { id: parseInt(id) } });

    return Response.json({ message: "Subject deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error(error); // Debugging
    return Response.json({ error: "Failed to delete subject." }, { status: 500 });
  }
}
