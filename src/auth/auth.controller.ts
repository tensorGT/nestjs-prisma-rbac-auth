import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import { Pool } from "pg";
import { LoginDto, RegisterDto } from "./auth.dto";
import { Roles, RolesGuard } from "./roles.guard";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/auth_db",
});

function hashPw(pw: string): string {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

@Controller("auth")
export class AuthController {
  constructor(private readonly jwt: JwtService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto) {
    const res = await pool.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [dto.email, hashPw(dto.password), dto.role || "user"]
    );
    return res.rows[0];
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [dto.email]);
    const user = res.rows[0];
    if (!user || user.password_hash !== hashPw(dto.password)) {
      return { error: "wrong email or password" };
    }
    const token = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_SECRET || "dev_secret" }
    );
