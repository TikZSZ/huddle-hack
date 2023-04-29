import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DevtoolsModule.register({
    http: process.env.NODE_ENV !== 'production',
  }), UsersModule,],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
