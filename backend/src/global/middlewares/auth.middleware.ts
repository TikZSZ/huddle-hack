import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor( private jwtService: JwtService){}
  async use(req: Request, res: any, next: () => void) {
    if(!req.session) {
      next()
      return
    }
    const userJwt = req.session.user as string|undefined;
    if(userJwt){
      const user = this.jwtService.verify(userJwt)
      req["user"] = user as {userId:number}
    }
    next()
  }
}