import { IsInt, IsDefined, IsString, IsOptional } from "class-validator";
import { RoomConfig, Experience } from "./";

export class User {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    ethAddress!: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsDefined()
    @IsString()
    nonce!: string;

    @IsDefined()
    roomConfigs!: RoomConfig[];

    @IsDefined()
    Experience!: Experience[];
}
