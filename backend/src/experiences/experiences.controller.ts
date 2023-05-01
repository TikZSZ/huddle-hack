import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetJwtToken } from 'src/global/decorators/param.decorator';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { JwtToken } from 'src/global/types/JwtToken';
import { PrismaService } from 'src/prisma.service';
import { InitMeetDTO, ExperienceDTO } from './experience';
import { ExperianceStatus } from 'src/global/models/enums';

@Controller( 'experiences' )
export class ExperiencesController
{
  constructor( private prisma: PrismaService ) { }

  @Get( "" )
  getExperinces ()
  {
    return this.prisma.experience.findMany( { orderBy: { id: "desc" }, include: { experianceStats: true, hosts: true, owner: true } } )
  }

  @Get( "/:experianceId" )
  getExperince ( @Param( "experianceId",new ParseIntPipe() ) experianceId: number )
  {
    return this.prisma.experience.findFirst( { include: { experianceStats: true, hosts: true,recordingMetadata:true,roomConfig:true,owner:true ,recordings:true,}, where: { id: experianceId } } )
  }

  @Get( "/:experianceId/recordings" )
  getRecordings ( @Param( "experianceId",new ParseIntPipe() ) experianceId: number )
  {
    return this.prisma.experience.findFirst( { include: { recordings: true }, where: { id: experianceId } } )
  }

  @Get( "/:experianceId/roomConfig" )
  getRoomConfig ( @Param( "experianceId",new ParseIntPipe() ) experianceId: number )
  {
    return this.prisma.experience.findFirst( { where: { id: experianceId },select:{roomConfig:true} } )
  }

  @Patch( "/:experianceId/stats" )
  @UseGuards( AuthGuard )
  updateExpStats ( @Param( "experianceId",new ParseIntPipe() ) experianceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    return this.prisma.experianceStats.update( { where: { id: experianceId }, data: {} } )
  }

  @Patch( "/:experianceId/initMeet" )
  @UseGuards( AuthGuard )
  initMeet ( @Body() data: InitMeetDTO, @Param( "experianceId",new ParseIntPipe() ) experianceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    const userId = jwtToken.userId
    return this.prisma.experience.update( {
      where: { id: experianceId }, data: {
        roomId: data.roomId,
        experianceStats: { update: { experianceStatus: data.experianceStatus } },
        roomCreationTime: ( new Date() ).toISOString()
      }
    } )
  }

  @Post( "" )
  @UseGuards( AuthGuard )
  async createExperiance ( @Body() data: ExperienceDTO, @GetJwtToken() jwtToken: JwtToken )
  {
    const userId = jwtToken.userId
    const user = await this.prisma.user.findUnique( { where: { id: userId } } )
    const { roomConfig, recordingMetadata, startTime, expiryTime, hosts, ...rest } = data
    if ( !user ) throw new BadRequestException()
    let verifiedHosts: { ethAddress: string }[] = [ { ethAddress: user.ethAddress } ]
    if ( hosts.length > 0 )
    {
      hosts.map( ( hostAddress ) =>
      {
        verifiedHosts.push( {
          ethAddress: hostAddress
        } )
      } )
    }
    return this.prisma.experience.create( {
      data: {
        ...rest,
        hosts: { connect: [ ...verifiedHosts ] },
        experianceStats: { create: { startTime, expiryTime, experianceStatus: ExperianceStatus.FINISHED } },
        recordingMetadata: { create: recordingMetadata },
        roomConfig: {
          create: {
            ...roomConfig, startTime, expiryTime, roomTitle: rest.expTitle, roomDescription: rest.expDescription,
            hostWallets: { connect: verifiedHosts }
          }
        },
        ownerId: userId
      }
    } )
  }
}
