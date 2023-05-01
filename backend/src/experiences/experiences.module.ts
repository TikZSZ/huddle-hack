import { Module } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { ExperiencesController } from './experiences.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ExperiencesService,PrismaService],
  controllers: [ExperiencesController]
})
export class ExperiencesModule {}
