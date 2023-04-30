import { IsInt, IsDefined, IsOptional, IsIn, IsString } from "class-validator";
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
    Experience!: Experience[];
}
