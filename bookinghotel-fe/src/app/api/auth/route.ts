// src/app/api/auth/route.ts
import { NextResponse } from "next/server";
import axios from "axios"; // dùng axios bình thường, không import api từ frontend

const BACKEND_URL = "http://localhost:3636";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "login") {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        usernameOrEmail: body.usernameOrEmail,
        password: body.password,
      });
      return NextResponse.json(res.data);
    }

    if (body.action === "register") {
      const res = await axios.post(`${BACKEND_URL}/auth/register`, {
        username: body.username,
        password: body.password,
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
      });
      return NextResponse.json(res.data);
    }

    return NextResponse.json({ message: "Hành động không hợp lệ!" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.response?.data?.message || "Lỗi server!" },
      { status: err.response?.status || 500 }
    );
  }
}
