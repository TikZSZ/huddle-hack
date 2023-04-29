import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(private prismaService:PrismaService) {}

  @Get()
  getHello(): any {
    return "hello world"
  }
}
