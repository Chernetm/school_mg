import Link from "next/link";
import { MdLock } from "react-icons/md";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <div className="flex justify-center text-red-500 mb-6">
          <MdLock className="text-6xl" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
