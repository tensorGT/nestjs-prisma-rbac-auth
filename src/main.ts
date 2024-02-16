import { Module, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import "reflect-metadata";
import { AuthController } from "./auth/auth.controller";
import { RolesGuard } from "./auth/roles.guard";

@Module({
