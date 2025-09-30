const { prisma } = require("@/utils/prisma");

export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        staff: { select: { staffID: true, firstName: true, lastName: true,middleName:true } },
        grade: { select: { id: true, grade: true } },
        subject: { select: { id: true, name: true } },
        section: { select: { id: true, section: true } }, // ✅ Fixed this line
      },
    });

    // Group assignments by staffID
    const groupedAssignments = assignments.reduce((acc, assignment) => {
      const { staff, grade, subject, section } = assignment;
      const staffKey = staff.staffID;

      if (!acc[staffKey]) {
        acc[staffKey] = {
          staffID: staff.staffID,
          firstName: staff.firstName,
          middleName:staff.middleName,
          lastName: staff.lastName,
          grade: grade.grade,
          subject: subject.name,
          sections: [],
        };
      }

      acc[staffKey].sections.push({ id: section.id, name: section.section }); // ✅ Updated to `section.section`

      return acc;
    }, {});

    return Response.json(Object.values(groupedAssignments));
  } catch (error) {
    console.error("Error fetching staff assignments:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export  async function POST(req, res) {
 
    try {
      const { staffID, gradeId, subjectId, sectionIds } = await req.json();
      console.log(staffID,gradeId,subjectId,sectionIds,"From req.body");
      if (!staffID || !gradeId || !subjectId || sectionIds.length === 0) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const assignments = sectionIds.map((sectionId) => ({
        staffID,
        gradeId,
        subjectId,
        sectionId,
      }));

      // Bulk insert assignments
      await prisma.assignment.createMany({
        data: assignments,
        skipDuplicates: true,

      });

      return Response.json({ message: 'Assignment created successfully' });
    } catch (error) {
      console.error('Error creating assignment:', error);
      return Response.json({ error: 'Internal server error' });
    }
  }

  export async function DELETE(req) {
    try {
      const { staffID } = await req.json();
  
      if (!staffID) {
        return Response.json({ error: "Staff ID is required" }, { status: 400 });
      }
  
      // Delete all assignments for the given staffID
      await prisma.assignment.deleteMany({
        where: { staffID },
      });
  
      return Response.json({ message: "All assignments deleted for this staff member" });
    } catch (error) {
      console.error("Error deleting assignments:", error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
    }
  }
 