const { prisma } = require("@/utils/prisma");
export async function DELETE(req, { params }) {
  try {
    const { id } = params; // ✅ Get ID from params
    await prisma.year.delete({
      where: { id: parseInt(id) },
    });
    return Response.json({ message: "Year deleted successfully." }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to delete year." }, { status: 500 });
  }
}
