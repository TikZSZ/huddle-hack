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

  @Get( "/:experienceId" )
  getExperince ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    return this.prisma.experience.findFirst( { include: { experianceStats: true, hosts: true, recordingMetadata: true, roomConfig: true, owner: true, recordings: true, }, where: { id: experienceId } } )
  }

  @Get( "/:experienceId/recordings" )
  getRecordings ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    return this.prisma.recording.findMany( { where: { experienceId }, select: { dateRecorded: true, recTitle: true, recDescription: true, } } )
  }

  @Get( "/:experienceId/roomConfig" )
  getRoomConfig ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    return this.prisma.experience.findFirst( { where: { id: experienceId }, select: { roomConfig: true } } )
  }

  @Patch( "/:experienceId/stats" )
  @UseGuards( AuthGuard )
  updateExpStats ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    return this.prisma.experianceStats.update( { where: { id: experienceId }, data: {} } )
  }

  @Patch( "/:experienceId/initMeet" )
  @UseGuards( AuthGuard )
  initMeet ( @Body() data: InitMeetDTO, @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    const userId = jwtToken.userId
    return this.prisma.experience.update( {
      where: { id: experienceId }, data: {
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
    let verifiedHosts: {
      where: { ethAddress: string },
      create: {
        ethAddress: string,
        nonce: string
      }
    }[] = [ { where:{ethAddress: user.ethAddress},create:{ethAddress:user.ethAddress,nonce:""} } ]
    if ( hosts.length > 0 )
    {
      hosts.map( ( hostAddress ) =>
      {
        verifiedHosts.push( {
          where:{ethAddress:hostAddress},
          create:{
            ethAddress:hostAddress,
            nonce:""
          }
        } )
      } )
    }
    return this.prisma.experience.create( {
      data: {
        ...rest,
        hosts: {
          connectOrCreate: {
            where: { ethAddress: "" },
            create: {
              ethAddress: "",
              nonce: ""
            }
          }
        },
        experianceStats: { create: { startTime, expiryTime, experianceStatus: ExperianceStatus.FINISHED } },
        recordingMetadata: { create: { ...recordingMetadata, tokenGatedRecording: rest.tokenGatedRecording } },
        roomConfig: {
          create: {
            ...roomConfig, startTime, expiryTime, roomTitle: rest.expTitle, roomDescription: rest.expDescription,
            hostWallets: { connectOrCreate: verifiedHosts }
          }
        },
        ownerId: userId
      }
    } )
  }
}
