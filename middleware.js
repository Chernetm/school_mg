

// import { adminAuthMiddleware } from "./middleware/adminAuthMiddleware";
// import { headAuthMiddleware } from "./middleware/headAuthMiddleware";
import { libraryAuthMiddleware } from "./middleware/libraryAuthMiddleware";
import { registrarAuthMiddleware } from "./middleware/registrarAuthMiddleware";
//import { studentAuthMiddleware } from "./middleware/studentAuthMiddleware";
import { teacherAuthMiddleware } from "./middleware/teacherAuthMiddleware";

export async function middleware(req) {
  console.log("✅ Middleware triggered for:", req.nextUrl.pathname);

  // ✅ Student Authentication Middleware (Only for `/api/exam/`)
  // if (req.nextUrl.pathname.startsWith("/api/student/") || req.nextUrl.pathname.startsWith("/student")) {
  //   return studentAuthMiddleware(req);
  // }
  if (req.nextUrl.pathname.startsWith("/api/library/") || req.nextUrl.pathname.startsWith("/library")) {
    return libraryAuthMiddleware(req);
  }

  //✅ Admin Authentication Middleware (Only for `/api/admin/`)
  // if (req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/admin")) {
  //   return adminAuthMiddleware(req);
  // }
  // // // ✅ Head Authentication Middleware (for both page and API routes)
  //  if (req.nextUrl.pathname.startsWith("/api/head") || req.nextUrl.pathname.startsWith("/head")) {
  //  return headAuthMiddleware(req);
  //  }

  // ✅ Registrar Authentication Middleware (for `/api/registrar/`)
  if (req.nextUrl.pathname.startsWith("/api/registrar/") || req.nextUrl.pathname.startsWith("/registrar")) {
    return registrarAuthMiddleware(req);
  }

  // ✅ Teacher Authentication Middleware (for `/api/teacher/`)
  if (req.nextUrl.pathname.startsWith("/api/teacher/")|| req.nextUrl.pathname.startsWith("/teacher")) {
    return teacherAuthMiddleware(req);
  }

  // ✅ Default logging middleware
  // return loggingMiddleware(req);    
}

export const config = {
  matcher: [
    "/api/student/:path*",
    // "/api/admin/:path*",
    // "/api/head/:path*",
    // "/api/registrar/:path*",
    "/api/teacher/:path*",
    "/api/library/:path*",
    "/api/exam/:path*",
    "/head/:path*", // ✅ Add this to match /head page routes
    "/admin/:path*", // ✅ Add this to match /admin page routes
    "/registrar/:path*", // ✅ Add this to match /registrar page routes
    "/teacher/:path*",  // ✅ Add this to match /teacher page routes
    "/student/:path*",
    "/library/:path*", // ✅ Add this to match /library page routes
    "/exam/:path*", 
    // "/login/:path*",
  ],
};
