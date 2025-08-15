// // This is the layout for the registrar dashboard
// import { Dashboard } from "@/components/Dashboard";
// import { Navbar } from "@/components/Navbar/NavBar";
// import { UserProvider } from "@/context/UserContext";
// import { headers } from "next/headers";

// export default async function registrarLayout({ children }) {
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
//           <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
//             <Dashboard />
//           </aside>
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


import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";


export default async function registrarLayout({ children }) {

 
  const session = await getServerSession(authOptions);
    
  const user = {
    role: session?.user.role,
    image: session?.user.image,
    // You can grab other header values similarly
  };

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <aside className="w-64 bg-gray-900 text-white fixed h-full z-40">
            <Dashboard />
          </aside>
          <main className="flex-1 ml-64 p-6 mt-10">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
