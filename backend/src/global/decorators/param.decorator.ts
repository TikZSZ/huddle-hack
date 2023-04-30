import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtToken } from '../types/JwtToken';

export const GetJwtToken = createParamDecorator(
  (data: string = "user", ctx: ExecutionContext) => {
    const request:Request = ctx.switchToHttp().getRequest();
    return request["user"]
  }
);