import { IsInt, IsDefined, IsString, IsOptional, IsDate, IsBoolean } from "class-validator";
import { User, RoomConfig, RecordingMetadata, Recording, ExperianceStats } from "./";

export class Experience {
    @IsDefined()
    @IsInt()
    id!: number;

    @IsDefined()
    @IsString()
    expTitle!: string;

    @IsOptional()
    @IsString()
    expDescription?: string;

    @IsOptional()
    @IsInt()
    participantsAllowed?: number;

    @IsOptional()
    @IsString()
    roomId?: string;

    @IsOptional()
    @IsDate()
    roomCreationTime?: Date;

    @IsDefined()
    @IsBoolean()
    tokenGatedRoom!: boolean;

    @IsDefined()
    @IsBoolean()
    tokenGatedRecording!: boolean;

    @IsDefined()
    @IsInt()
    ownerId!: number;

    @IsDefined()
    owner!: User;

    @IsDefined()
    hosts!: User[];

    @IsOptional()
    roomConfig?: RoomConfig;

    @IsOptional()
    recordingMetadata?: RecordingMetadata;

    @IsDefined()
    recordings!: Recording[];

    @IsOptional()
    experianceStats?: ExperianceStats;
}
