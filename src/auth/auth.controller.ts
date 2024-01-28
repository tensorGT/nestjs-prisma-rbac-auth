import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as crypto from "crypto";
import { Pool } from "pg";
import { LoginDto, RegisterDto } from "./auth.dto";
import { Roles, RolesGuard } from "./roles.guard";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/auth_db",
