
import { Dashboard } from "@/components/Dashboard";
import { Navbar } from "@/components/Navbar/NavBar";
import { Providers } from "@/components/Providers";
import { UserProvider } from "@/context/UserContext";
import { headers } from "next/headers";

export default async function AdminLayout({ children }) {
  const headersList = await headers(); // ✅ await here

  const user = {
    role: headersList.get("x-user-role"),
    image: headersList.get("x-user-image"),
    staffID:headersList.get("x-user-id"),
    // You can grab other header values similarly
  };

  return (
    <Providers>
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
    </Providers>
  );
}
