// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import api from "@/axios/axios"

// API ĐĂNG KÝ
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Kiểm tra hành động (register hoặc login)
    if (body.action === "register") {
      const res = await api.post("/auth/register", {
        username: body.username,
        password: body.password,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
		dob: body.dob,
      });

      return NextResponse.json(res.data);
    }

    // Nếu là đăng nhập
    if (body.action === "login") {
      const res = await api.post("/auth/login", {
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });

      return NextResponse.json(res.data);
    }

    return NextResponse.json({ message: "Hành động không hợp lệ!" }, { status: 400 });
  } catch (error: any) {
    console.error("Auth API error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || "Lỗi server!" },
      { status: error.response?.status || 500 }
    );
  }
}
