// This is the layout for the teacher dashboard
// This is the layout for the teacher dashboard
import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";
import { headers } from "next/headers";

export default async function TeacherLayout({ children }) {
  const headersList = await headers(); // ✅ await here

  const user = {
    role: headersList.get("x-user-role"),
    // You can grab other header values similarly
  };

  return (
    <UserProvider initialUser={user}>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex flex-1">
          <main className="flex-1 ml-64 p-6 mt-10">
            {children}
          </main>
        </div>
      </div>
    </UserProvider>
  );
}
