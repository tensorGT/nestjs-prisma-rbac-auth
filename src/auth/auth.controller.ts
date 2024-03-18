import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";
import { LoginDto, RegisterDto } from "./auth.dto";
import { Roles, RolesGuard } from "./roles.guard";

const prisma = new PrismaClient();

function hashPw(pw: string): string {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

@Controller("auth")
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    return prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashPw(dto.password),
        role: dto.role || "user",
      },
      select: { id: true, email: true, role: true },
    });
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || user.passwordHash !== hashPw(dto.password)) {
      return { error: "wrong email or password" };
    }
    const token = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET || "dev_secret" }
    );
    return { access_token: token };
  }

  @Get("admin-only")
  @UseGuards(RolesGuard)
  @Roles("admin")
  adminPing(@Req() req: { user: { email: string } }) {
    return { ok: true, admin: req.user.email };
  }
}
