import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";
import { headers } from "next/headers";

export default async function TeacherLayout({ children }) {
  const headersList = await headers();

  const user = {
    role: headersList.get("x-user-role"),
    image: headersList.get("x-user-image"),
    staffID: headersList.get("x-user-id"),
    grade: headersList.get("x-user-grade"),
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
