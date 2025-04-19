import Link from "next/link";
import { BiError } from "react-icons/bi";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md">
        <div className="flex justify-center text-yellow-500 mb-6">
          <BiError className="text-6xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
