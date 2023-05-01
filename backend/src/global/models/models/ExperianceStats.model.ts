import { IsInt, IsDefined, IsIn, IsDate, IsOptional } from "class-validator";
import { Experience } from "./";
import { getEnumValues } from "../helpers";
import { ExperianceStatus } from "../enums";

export class ExperianceStats {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsIn(getEnumValues(ExperianceStatus))
    experianceStatus!: ExperianceStatus;

    @IsDefined()
    @IsInt()
    totalRatings!: number;

    @IsDefined()
    @IsInt()
    overallRating!: number;

    @IsOptional()
    @IsDate()
    startTime?: Date;

    @IsOptional()
    @IsDate()
    expiryTime?: Date;

    @IsOptional()
    @IsDate()
    lastMeet?: Date;

    @IsDefined()
    experience!: Experience;

    @IsDefined()
    @IsInt()
    experienceId!: number;
}
