import { Controller, Get, Param, Patch } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Controller('experiences')
export class ExperiencesController {
  constructor(private prisma:PrismaService){}

  @Get("")
  getExperinces(){
    return this.prisma.experience.findMany({orderBy:{id:"desc"},include:{experianceStats:true,hosts:true,owner:true}})
  }

  @Get("/:experianceId")
  getExperince(@Param("experianceId") experianceId:number){
    return this.prisma.experience.findFirst({include:{experianceStats:true,hosts:true,owner:true},where:{id:experianceId}})
  }

  @Get("/:experianceId/recordings")
  getRecordings(@Param("experianceId") experianceId:number){
    return this.prisma.experience.findFirst({include:{recordings:true},where:{id:experianceId}})
  }

  @Get("/:experianceId/roomConfig")
  getRoomConfig(@Param("experianceId") experianceId:number){
    return this.prisma.experience.findFirst({include:{roomConfig:true},where:{id:experianceId}})
  }

  @Patch("/:experianceId/stats")
  updateExpStats(@Param("experianceId") experianceId:number){
    return this.prisma.experianceStats.update({where:{id:experianceId},data:{}})
  }
}
