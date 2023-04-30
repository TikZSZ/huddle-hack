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

    @IsDefined()
    @IsInt()
    participantsAllowed!: number;

    @IsDefined()
    @IsInt()
    currentParticipants!: number;

    @IsDefined()
    @IsInt()
    roomId!: number;

    @IsDefined()
    @IsDate()
    timeCreated!: Date;

    @IsDefined()
    @IsBoolean()
    tokenGatedRoom!: boolean;

    @IsDefined()
    @IsBoolean()
    tokenGatedRecording!: boolean;

    @IsDefined()
    user!: User;

    @IsDefined()
    roomConfig!: RoomConfig;

    @IsDefined()
    recordingMetadata!: RecordingMetadata;

    @IsDefined()
    recordings!: Recording[];

    @IsDefined()
    experianceStats!: ExperianceStats;

    @IsDefined()
    @IsInt()
    userId!: number;

    @IsDefined()
    @IsInt()
    roomConfigId!: number;

    @IsDefined()
    @IsInt()
    recordingMetadataId!: number;

    @IsDefined()
    @IsInt()
    experianceStatsId!: number;
}
