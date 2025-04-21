import { getStaffIDFromToken } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
export async function POST(req) {
    try {
      const body = await req.json();
      const { title, message, audience, gradeId } = body;
      console.log(title, message, audience, gradeId);   
  
      const staffID = await getStaffIDFromToken();
        console.log("Staff ID:", staffID);
  
      if (!staffID) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
      }
  
      if (!title || !message || !audience || !gradeId) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
  
      const announcement = await prisma.announcement.create({
        data: {
          title,
          message,
          audience,
          gradeId: Number(gradeId),
          staffID: Number(staffID),
        },
      });
  
      return new Response(JSON.stringify(announcement), { status: 200 });
    } catch (error) {
      console.error('Create Announcement Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create announcement' }), { status: 500 });
    }
  }
  