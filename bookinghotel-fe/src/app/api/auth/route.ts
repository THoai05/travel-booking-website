// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import api from "@/axios/axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔹 Đăng ký
    if (body.action === "register") {
      const res = await api.post("/auth/register", {
        username: body.username,
        password: body.password,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        dob: body.dob,
        gender: body.gender,
      });

      return NextResponse.json(res.data);
    }

    // 🔹 Đăng nhập
    if (body.action === "login") {
      const res = await api.post("/auth/login", {
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });

      return NextResponse.json({
        message: res.data.message,
        token: res.data.token,
      });
    }

    return NextResponse.json(
      { message: "Hành động không hợp lệ!" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Auth API error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || "Lỗi server!" },
      { status: error.response?.status || 500 }
    );
  }
}

// 🔹 Hàm GET để lấy profile
export async function GET(req: Request) {
  try {
    // Lấy token từ header
    let token = req.headers.get("authorization");

    // Nếu chỉ nhận được token thô (không có Bearer) thì thêm vào
    if (token && !token.startsWith("Bearer ")) {
      token = `Bearer ${token}`;
    }

    if (!token) {
      return NextResponse.json(
        { message: "Token không tồn tại" },
        { status: 401 }
      );
    }

    // Gọi đến backend NestJS
    const res = await api.get("http://localhost:3636/auth/profile", {
      headers: {
        Authorization: token,
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Profile API error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: error.response?.data?.message || "Lỗi server!" },
      { status: error.response?.status || 500 }
    );
  }
}


