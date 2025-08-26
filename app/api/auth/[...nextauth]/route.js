// app/api/auth/[...nextauth]/route.js (App Router)
import ApiError from '@/lib/api-error';
import { prisma } from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 600, // 10 mins
});

export const authOptions = {
  providers: [
    // 🎓 STUDENT LOGIN
    CredentialsProvider({
      id: 'student-login',
      name: 'Student Login',
      credentials: {
        studentID: { label: 'Student ID', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      // Debugging line
      async authorize(credentials, req) {
        const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        await rateLimiter.consume(ip).catch(() => {
          throw new ApiError('Too many login attempts. Please try again later.', 429);
        });

        const student = await prisma.student.findUnique({
          where: {
            studentID: credentials.studentID,
            // status: 'active',
          },
          include: {
            registrations: {
              orderBy: { createdAt: 'desc' },
              select: {
                grade: true,

              },
            },
          },
        });


        console.log(student, "student"); // Debugging line to check student data

        if (!student) throw new ApiError('No student found', 404);
        const isValid = await bcrypt.compare(credentials.password, student.password);
        if (!isValid) throw new ApiError('Invalid password', 401);

        // Extract grade from latest registration
        const latestGrade = student.registrations?.[0]?.grade || null;

        return {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          role: 'student',
          studentID: student.studentID,
          grade: latestGrade,
        };

      },
    }),
    CredentialsProvider({
      id: 'teacher-login',
      name: 'Teacher Login',
      credentials: {
        staffID: { label: 'Staff ID', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        await rateLimiter.consume(ip).catch(() => {
          throw new ApiError('Too many login attempts. Please try again later.', 429);
        });

        const staff = await prisma.staff.findUnique({
          where: {
            staffID: Number(credentials.staffID),
            email: credentials.email,
            status: 'active',
            


          },
        });

        if (!staff) throw new ApiError('No staff user found', 404);
        if (!['teacher', 'staff', 'library'].includes(staff.role)) {
          throw new ApiError(403, 'Unauthorized access');
        }
        const isValid = await bcrypt.compare(credentials.password, staff.password);
        if (!isValid) throw new ApiError('Invalid password', 401);

        return {
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
          role: staff.role, // 🔐 e.g., 'ADMIN', 'TEACHER', etc.
          staffID: staff.staffID,
          image: staff.image,
          

        };
      },
    }),


    // 👩‍🏫 STAFF LOGIN (Admin, Registrar, Teacher, etc.)
    CredentialsProvider({
      id: 'admin-login',
      name: 'Admin Login',
      credentials: {
        staffID: { label: 'Staff ID', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
        await rateLimiter.consume(ip).catch(() => {
          throw new ApiError('Too many login attempts. Please try again later.', 429);
        });

        const staff = await prisma.staff.findUnique({
          where: {
            staffID: Number(credentials.staffID),
            email: credentials.email,
            status: 'active'

          },
        });

        if (!staff) throw new ApiError('No staff user found', 404);
        if (!['admin', 'head', 'registrar'].includes(staff.role)) {
          throw new ApiError(403, 'Unauthorized access');
        }
        const isValid = await bcrypt.compare(credentials.password, staff.password);
        if (!isValid) throw new ApiError('Invalid password', 401);

        return {
          id: staff.id,
          name: `${staff.firstName} ${staff.lastName}`,
          role: staff.role, // 🔐 e.g., 'ADMIN', 'TEACHER', etc.
          staffID: staff.staffID,
          image: staff.image,
        };
      },
    }),
  ],



  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour
    updateAge: 15 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.staffID = user.staffID || null;
        token.studentID = user.studentID || null;
        token.grade = user.grade || null; // Add grade for students
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.staffID = token.staffID;
      session.user.studentID = token.studentID;
      session.user.grade = token.grade
      return session;
    },

  },

  //   pages: {
  //     signIn: '/login/admin', // Optional: custom login page
  //   },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
