import { Navbar } from "@/components/Navbar/NavBar";
import { UserProvider } from "@/context/UserContext";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function LibraryLayout({ children }) {
 
const session = await getServerSession(authOptions);
    
  const user = {
    role: session?.user.role,
    image: session?.user.image,
    staffID:session?.user.staffID,
    // You can grab other header values similarly
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
