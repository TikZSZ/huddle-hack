import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import session from "cookie-session"
import { AuthMiddleWare } from './global/middlewares/auth.middleware';

const secret = process.env.SECRET || 'asdf';
const isProd = process.env.NODE_ENV === 'production';

const CookieProdConfig = {
  secure: true,
  httpOnly: true,
  sameSite: 'none',
  signed: false,
  maxAge: 10000000,
};

const CookieDevConfig = {
  secureProxy: true,
  httpOnly: false,
  signed: false,
  sameSite: 'none',
};



@Module({
  imports: [DevtoolsModule.register({
    http: process.env.NODE_ENV !== 'production',
  }), UsersModule,],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(
      session( isProd ? CookieProdConfig : CookieDevConfig as any),
    )
      .forRoutes('*')
      .apply(AuthMiddleWare)
      .forRoutes('*');
  }
}