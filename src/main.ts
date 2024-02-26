import { Module, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import "reflect-metadata";
import { AuthController } from "./auth/auth.controller";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [RolesGuard],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
