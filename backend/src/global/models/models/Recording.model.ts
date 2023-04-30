import { IsInt, IsDefined, IsDate, IsString, IsOptional } from "class-validator";
import { Experience } from "./";

export class Recording {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsDate()
    dateRecorded!: Date;

    @IsOptional()
    @IsString()
    url?: string;

    @IsDefined()
    @IsString()
    recTitle!: string;

    @IsDefined()
    @IsString()
    recDescription!: string;

    @IsDefined()
    Experience!: Experience;

    @IsDefined()
    @IsInt()
    experienceId!: number;
}
