
// // This is the layout for the teacher dashboard
// // This is the layout for the teacher dashboard
// import { Navbar } from "@/components/Navbar/NavBar";
// import { UserProvider } from "@/context/UserContext";
// import { headers } from "next/headers";

// export default async function TeacherLayout({ children }) {
//   const headersList = await headers(); // ✅ await here

//   const user = {
//     role: headersList.get("x-user-role"),
//     image: headersList.get("x-user-image"),
//     staffID:headersList.get("x-user-id"),
   
//     // You can grab other header values similarly
//   };
//   return (
//     <UserProvider initialUser={user}>
//       <div className="min-h-screen flex flex-col bg-gray-100">
//         <Navbar />
//         <div className="flex flex-1">
//           <main className="flex-1 ml-64 p-6 mt-10">
//             {children}
//           </main>
//         </div>
//       </div>
//     </UserProvider>
//   );
// }


import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";


export default async function teacherLayout({ children }) {

 
  const session = await getServerSession(authOptions);
    
  const user = {
    role: session?.user.role,
    image: session?.user.image,
    staffID:session?.user.staffID,
    grade:session?.user.grade
  };

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 mt-16 w-full max-w-screen mx-auto">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
