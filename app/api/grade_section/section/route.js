const { prisma } = require("@/utils/prisma");


export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const gradeId = searchParams.get('gradeId');

    if (!gradeId) {
      return new Response(JSON.stringify({ error: 'Grade ID is required' }), { status: 400 });
    }

    const sections = await prisma.gradeSection.findMany({
      where: { gradeId: parseInt(gradeId) },
      include: { section: true },
    });

    return new Response(JSON.stringify(sections.map((gs) => ({ id: gs.section.id, name: gs.section.section }))), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


// export async function GET(req, res) {
  
//     try {
//       const { gradeId } = req.query;

//       if (!gradeId) {
//         return res.status(400).json({ error: 'Grade ID is required' });
//       }

//       const sections = await prisma.gradeSection.findMany({
//         where: { gradeId: parseInt(gradeId) },
//         include: { section: true },
//       });

//       res.status(200).json(sections.map((gs) => ({ id: gs.section.id, name: gs.section.section })));
//     } catch (error) {
//       console.error('Error fetching sections:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }