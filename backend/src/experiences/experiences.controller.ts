import { BadRequestException, Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetJwtToken } from 'src/global/decorators/param.decorator';
import { AuthGuard } from 'src/global/guards/auth.guard';
import { JwtToken } from 'src/global/types/JwtToken';
import { PrismaService } from 'src/prisma.service';
import { InitMeetDTO, ExperienceDTO, WrapUpDTO, } from './experience';
import { ExperianceStatus } from 'src/global/models/enums';
import lighthouse from "@lighthouse-web3/sdk"
import https from "https"
import fs from "fs"
import path from 'path';
import { authResponse } from '@lighthouse-web3/sdk/dist/Lighthouse/createCAR/dataDepotAuth';
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
    return this.prisma.experience.findFirst( { include: { experianceStats: true, hosts: true }, where: { id: experienceId } } )
  }

  @Get( "/:experienceId/roomConfig" )
  async getRoomConfig ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    const exp = await this.prisma.experience.findFirst( { where: { id: experienceId }, select: { roomConfig: true, tokenGatedRoom: true } } )
    if ( !exp ) throw new NotFoundException()
    if ( !exp.roomConfig ) throw new NotFoundException()
    const { roomConfig, ...rest } = exp

    if ( !rest.tokenGatedRoom )
    {
      const { chain, conditionType, conditionValue, tokenType, contractAddress, ...newRoomConfig } = roomConfig
      return newRoomConfig
    }
    return roomConfig
  }

  @Get( "/:experienceId/expRecMetadata" )
  async getExpRecMetadata ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    const recM = await this.prisma.recordingMetadata.findUnique( { where: { experienceId } } )
    if ( !recM ) throw new NotFoundException()
    return recM
  }

  @Get( "/:experienceId/recordings" )
  getRecordings ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number )
  {
    return this.prisma.recording.findMany( { where: { experienceId }, select: { id: true, recTitle: true, recDescription: true, dateRecorded: true } } )
  }

  @Get( "/:experienceId/recordings/:recordId" )
  async getRecording ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @Param( "recordId", new ParseIntPipe() ) recordId: number )
  {
    const recMetadata = await this.prisma.recordingMetadata.findUnique( { where: { experienceId: experienceId } } )
    if ( !recMetadata ) throw new BadRequestException()
    const recording = await this.prisma.recording.findUnique( { where: { id: recordId } } )
    if ( !recording ) throw new NotFoundException()

    if ( !recMetadata.tokenGatedRecording )
    {
      return { recMetadata, recording }
    }
    if ( recMetadata.tokenType !== "REC20" )
    {
      throw new BadRequestException( "Not implemented" )
      // backend checks and then return url for download
      // return {recMetadata,recording}
    }
    if ( !recording.recContractId ) throw new NotFoundException()
    return { recMetadata, recording: null, recContractId: recording!.recContractId }
  }

  @Post( "/:experienceId/recordings/:recordId/generateCar" )
  @UseGuards( AuthGuard )
  async getCarFile ( @Body() data: { url: string } )
  {
    if ( !data.url ) throw new BadRequestException()
    const downloadedFilePath = await this.downloadFile( data.url )
    // Get an auth token for the data depot service
    // Note: you can use this token multiple times it expires in 20 days
    const apiKey = process.env[ 'LIGHTHOUSE_API_KEY' ]
    if ( !apiKey ) throw new InternalServerErrorException( "light house api key not found" )
    const authToken = await lighthouse.dataDepotAuth( apiKey )
    const carFile = await this.generateCAR( downloadedFilePath.filePath, authToken )
    const d = await lighthouse.viewCarFiles( 1, authToken.data.access_token )
    //https://data-depot.lighthouse.storage/api/download/download_car?fileId=${fileId}.car
    // carLink https://gateway.lighthouse.storage/ipfs/bafybeicyzhl2f57t2tobokywkw2raqxu2yvm7s2x6y4tcgixc2ub4gg5te
    return { ...d.data[ 0 ], carLink: `https://data-depot.lighthouse.storage/api/download/download_car?fileId=${d.data[0].id}.car` }
  }

  private downloadFile ( url: string )
  {
    const fileName = path.basename( url );
    const filePath = path.join( __dirname, "..", 'downloads', fileName );

    return new Promise<{ filePath: string }>( ( res, rej ) =>
    {
      if ( !fs.existsSync( path.dirname( filePath ) ) )
      {
        fs.mkdirSync( path.dirname( filePath ), { recursive: true } );
      }
      https.get( url, ( response ) =>
      {
        const fileStream = fs.createWriteStream( filePath, { flags: 'wx' } );
        response.pipe( fileStream );

        response.on( 'error', ( error ) =>
        {
          console.error( `Error downloading file ${fileName}: ${error.message}` );
          rej( error.message )
        } );

        fileStream.on( 'finish', () =>
        {
          fileStream.close()
          console.log( `File ${fileName} downloaded successfully!` );
          res( { filePath: filePath } )
        } );

        fileStream.on( 'error', ( error ) =>
        {
          fs.unlink( filePath, () =>
          {
            console.error( `Error downloading file ${fileName}: ${error.message}` );
            rej( error.message )
          } );
        } );
      } );
    } )
  }

  async generateCAR ( filePath: string, authToken: authResponse )
  {


    // Create CAR
    const response = await lighthouse.createCar( filePath, authToken.data.access_token )

    console.log( response )
    /*
      { data: 'Uploaded the files successfully' }
    */
    return response
  }

  @Patch( "/:experienceId/stats" )
  @UseGuards( AuthGuard )
  updateExpStats ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    return this.prisma.experianceStats.update( { where: { id: experienceId }, data: {} } )
  }

  @Patch( "/:experienceId/initMeet" )
  @UseGuards( AuthGuard )
  async initMeet ( @Body() data: InitMeetDTO, @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @GetJwtToken() jwtToken: JwtToken )
  {
    const exp = await this.prisma.experience.findUnique( { where: { id: experienceId } } )
    if ( !exp ) throw new NotFoundException()
    const roomCreationTime = new Date()
    return this.prisma.experience.update( {
      where: { id: experienceId }, data: {
        roomId: data.roomId,
        experianceStats: { update: { experianceStatus: "ONGOING", lastMeet: roomCreationTime.toISOString() } },
        roomCreationTime: roomCreationTime.toISOString()
      },
      include: { experianceStats: true, hosts: true }
    } )
  }

  @Patch( "/:experienceId/wrapUp" )
  @UseGuards( AuthGuard )
  async wrapUp ( @Param( "experienceId", new ParseIntPipe() ) experienceId: number, @Body() data: WrapUpDTO )
  {
    const exp = await this.prisma.experience.findUnique( { where: { id: experienceId }, select: { id: true, experianceStats: { select: { experianceStatus: true } }, tokenGatedRecording: true } } )
    if ( !exp ) throw new NotFoundException()
    if ( exp.experianceStats!.experianceStatus === "FINISHED" ) throw new BadRequestException()
    const { saveRecording, recContractId, url, ...rest } = data
    if ( !saveRecording )
    {
      return this.prisma.experience.update( {
        where: { id: experienceId }, data: {
          experianceStats: { update: { experianceStatus: "FINISHED" } },
        },
        include: { experianceStats: true, hosts: true }
      } )
    } else if ( url && !exp.tokenGatedRecording )
    {
      return this.prisma.experience.update( {
        where: { id: experienceId }, data: {
          experianceStats: { update: { experianceStatus: "FINISHED" } },
          recordings: {
            create: {
              ...rest, url,
              dateRecorded: ( new Date() ).toISOString()
            }
          }
        },
        include: { experianceStats: true, hosts: true }
      } )
    } else
    {
      return this.prisma.experience.update( {
        where: { id: experienceId }, data: {
          experianceStats: { update: { experianceStatus: "FINISHED" } },
          recordings: {
            create: {
              ...rest, recContractId,
              dateRecorded: ( new Date() ).toISOString()
            }
          }
        },
        include: { experianceStats: true, hosts: true }
      } )
    }


    // recordings:{create:{
    //   dateRecorded: new Date(),
    //   recDescription:"dasdad",
    //   recTitle:"adad",
    //   url:"string"
    // }}
  }

  @Post( "" )
  @UseGuards( AuthGuard )
  async createExperiance ( @Body() data: ExperienceDTO, @GetJwtToken() jwtToken: JwtToken )
  {
    const userId = jwtToken.userId
    const user = await this.prisma.user.findUnique( { where: { id: userId } } )
    const { roomConfig, recordingMetadata, startTime, expiryTime, hosts, ...rest } = data
    if ( !user ) throw new BadRequestException()
    if ( hosts.length < 1 ) throw new BadRequestException()

    let verifiedHosts: {
      where: { ethAddress: string },
      create: {
        ethAddress: string,
        nonce: string
      }
    }[] = []

    {
      hosts.map( ( hostAddress ) =>
      {
        verifiedHosts.push( {
          where: { ethAddress: hostAddress },
          create: {
            ethAddress: hostAddress,
            nonce: ""
          }
        } )
      } )
    }
    return this.prisma.experience.create( {
      data: {
        ...rest,
        hosts: {
          connectOrCreate: verifiedHosts
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
