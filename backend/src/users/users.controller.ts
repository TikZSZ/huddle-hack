import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { sign } from 'crypto';
import { PrismaService } from 'src/prisma.service';
import ethUtil from "@metamask/eth-sig-util"
import { JwtService } from '@nestjs/jwt';
@Controller('users')
export class UsersController {
  constructor (private prisma:PrismaService, private jwtService: JwtService){}
  @Get("exists")
  async userExists(@Query("ethAddress") ethAddress:string){
    const user = await this.prisma.user.findUnique({where:{ethAddress}})
    return !!user
  }

  @Post('login')
  async signup(@Body() data: { ethAddress: string, signature: string }): Promise<{ token: string }> {
    const { ethAddress, signature } = data;

    // Verify signature
    const message = 'Please sign up to our app using your Ethereum address.';
    const recoveredAddress = ethUtil.recoverPersonalSignature({
      data:message,
      signature:signature
    })
    if (recoveredAddress.toLowerCase() !== ethAddress.toLowerCase()) {
      throw new BadRequestException('Invalid signature.');
    }

    // Create user
    const user = await this.prisma.user.findUnique({ where:{ethAddress}});
    if(!user) throw new NotFoundException()
    // Generate JWT
    const token = this.jwtService.sign({ userId: user.id });

    return { token };
  }
}
