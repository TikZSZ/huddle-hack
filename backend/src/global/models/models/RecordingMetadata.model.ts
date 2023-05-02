import { IsInt, IsDefined, IsOptional, IsIn, IsString, IsBoolean } from "class-validator";
import { Experience } from "./";
import { getEnumValues } from "../helpers";
import { Chain, TokenType } from "../enums";

export class RecordingMetadata {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsOptional()
    @IsIn(getEnumValues(Chain))
    chain?: Chain;

    @IsOptional()
    @IsIn(getEnumValues(TokenType))
    tokenType?: TokenType;

    @IsOptional()
    @IsString()
    contractAddress?: string;

    @IsDefined()
    @IsBoolean()
    tokenGatedRecording!: boolean;

    @IsDefined()
    experience!: Experience;

    @IsDefined()
    @IsInt()
    experienceId!: number;
}
