import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {recoverPersonalSignature} from "@metamask/eth-sig-util"
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { GetJwtToken } from 'src/global/decorators/param.decorator';
import { JwtToken } from 'src/global/types/JwtToken';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor (private prisma:PrismaService, private jwtService: JwtService,private userService:UsersService){}
  
  @Get("/:ethAddress/nonce")
  async userExists(@Param("ethAddress") ethAddress:string){
    let user = await this.prisma.user.findUnique({where:{ethAddress}})
    const nonce = await this.userService.generateNonce()
    if(user) {
      await this.prisma.user.update({where:{ethAddress},data:{nonce}})
    }else {
      await this.prisma.user.create({data:{ethAddress,nonce}})
      return {nonce}
    }
    return {nonce}
  }

  @Post('/:ethAddress/login')
  async signup(@Param("ethAddress") ethAddress:string,@Body() data: { nonce: string, signature: string },@Req() req:Request)  {
    const { nonce, signature } = data;

    const user = await this.prisma.user.findUnique({ where:{ethAddress}});

    if(!user) throw new NotFoundException()

    if(user.nonce !== nonce) throw new UnauthorizedException()
    // Verify signature
    const message = `Please sign this ${nonce}`;
    const recoveredAddress = recoverPersonalSignature({
      data:message,
      signature:signature,
      
    })
    if (recoveredAddress.toLowerCase() !== ethAddress.toLowerCase()) {
      throw new BadRequestException('Invalid signature.');
    }
    // Generate JWT
    const token = this.jwtService.sign({ userId: user.id });
    req.session!["user"] = token
    return { user,token };
  }

  @Post('/verifyUser')
  async verifyAccess(@GetJwtToken() jwtToken:JwtToken)  {
    if(!jwtToken) throw new UnauthorizedException()
    const user = await this.prisma.user.findUnique({where:{id:jwtToken.userId}})
    if(user) {
      return user
    }
  }
}
