import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: process.env["JWT_SECRET"],
    }),
  ],
  providers: [UsersService,PrismaService],
  controllers: [UsersController]
})
export class UsersModule {}
