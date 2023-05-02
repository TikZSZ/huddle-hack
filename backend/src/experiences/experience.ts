import { IsInt, IsDefined, IsString, IsISO8601, IsArray,IsOptional, IsDate, IsBoolean, IsIn, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer"
import { getEnumValues } from "../global/models/helpers";
import { ExperianceStatus,Chain,ConditionType,TokenType } from "../global/models/enums";

export class InitMeetDTO
{
  @IsDefined()
  @IsString()
  roomId: string
}


export class RoomConfig {

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
}

export class RecordingMetadata {
  @IsOptional()
  @IsIn(getEnumValues(Chain))
  chain?: Chain;

  @IsOptional()
  @IsIn(getEnumValues(TokenType))
  tokenType?: TokenType;

  @IsOptional()
  @IsString()
  contractAddress?: string;
}




export class ExperienceDTO
{
  @IsDefined()
  @IsString()
  expTitle!: string;

  @IsOptional()
  @IsString()
  expDescription?: string;

  @IsOptional()
  @IsInt()
  participantsAllowed!: number;

  @IsDefined()
  @IsBoolean()
  tokenGatedRoom!: boolean;

  @IsDefined()
  @IsBoolean()
  tokenGatedRecording!: boolean;

  @IsDefined()
  @IsISO8601()
  startTime: Date;

  @IsDefined()
  @IsISO8601()
  expiryTime: Date;

  @IsOptional()
  @IsArray()
  // "each" tells class-validator to run the validation on each item of the array
  @IsString({ each: true })
  hosts!: string[];

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type( () => RoomConfig )
  roomConfig: RoomConfig;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type( () => RecordingMetadata )
  recordingMetadata: RecordingMetadata;
}
