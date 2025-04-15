import { adminAuthMiddleware } from "./middleware/adminAuthMiddleware";
import { headAuthMiddleware } from "./middleware/headAuthMiddleware";
import { registrarAuthMiddleware } from "./middleware/registrarAuthMiddleware";
import { studentAuthMiddleware } from "./middleware/studentAuthMiddleware";
import { teacherAuthMiddleware } from "./middleware/teacherAuthMiddleware";


export async function middleware(req) {
  console.log("✅ Middleware triggered for:", req.nextUrl.pathname);

  // ✅ Student Authentication Middleware (Only for `/api/exam/`)
  if (req.nextUrl.pathname.startsWith("/api/student/")) {
    return studentAuthMiddleware(req);
  }

  // ✅ IP Restriction Middleware (Only for `/admin/`)
  if (req.nextUrl.pathname.startsWith("/api/admin/")) {
    return adminAuthMiddleware(req);
  }
  if (req.nextUrl.pathname.startsWith("/api/head/")) {
    return headAuthMiddleware(req);
  }
  if (req.nextUrl.pathname.startsWith("/api/registrar/")) {
    return registrarAuthMiddleware(req);
  }
  if (req.nextUrl.pathname.startsWith("/api/teacher/")) {
    return teacherAuthMiddleware(req);
  }
  // ✅ Default logging middleware
  // return loggingMiddleware(req);    
}

// ✅ Match only specific routes
export const config = {
  matcher: ["/api/student/:path*", "/api/admin/:path*", "/api/head/:path*", "/api/registrar/:path*", "/api/teacher/:path*"],
};
