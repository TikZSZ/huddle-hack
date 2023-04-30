import { IsInt, IsDefined, IsString, IsOptional, IsDate, IsBoolean, IsIn } from "class-validator";
import { User, Experience } from "./";
import { getEnumValues } from "../helpers";
import { TokenType, Chain, ConditionType } from "../enums";

export class RoomConfig {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    roomTitle!: string;

    @IsOptional()
    @IsString()
    roomDescription?: string;

    @IsOptional()
    @IsDate()
    startTime?: Date;

    @IsOptional()
    @IsDate()
    expiryTime?: Date;

    @IsDefined()
    hostWallets!: User[];

    @IsDefined()
    @IsBoolean()
    roomLocked!: boolean;

    @IsDefined()
    @IsBoolean()
    muteOnEntry!: boolean;

    @IsDefined()
    @IsBoolean()
    videoOnEntry!: boolean;

    @IsOptional()
    @IsIn(getEnumValues(TokenType))
    tokenType?: TokenType;

    @IsOptional()
    @IsIn(getEnumValues(Chain))
    chain?: Chain;

    @IsOptional()
    @IsString()
    contractAddress?: string;

    @IsOptional()
    @IsIn(getEnumValues(ConditionType))
    conditionType?: ConditionType;

    @IsOptional()
    @IsString()
    conditionValue?: string;

    @IsDefined()
    Experience!: Experience[];
}
