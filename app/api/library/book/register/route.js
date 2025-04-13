const { prisma } = require('@/utils/prisma');

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, author, grade, copies } = body;

    if (!title || !author || !grade || !copies) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        grade,
        copies: parseInt(copies),
      },
    });

    return Response.json({ message: 'Book registered successfully.', book }, { status: 201 });
  } catch (error) {
    console.error('Register Book Error:', error);
    return Response.json({ error: 'Failed to register book.' }, { status: 500 });
  }
}
