export type User = {
  id: number
  ethAddress: string
  email: string | null
  nonce: string
}

export type Experiences = Omit<Experience,"roomConfig"|"recordingMetadata"|"recordings"|"">[]
export interface Experience {
  id: number;
  expTitle: string;
  expDescription: string;
  participantsAllowed: number;
  roomId: string|null;
  roomCreationTime: string|null;
  tokenGatedRoom: boolean;
  tokenGatedRecording: boolean;
  ownerId: number;
  experianceStats: ExperianceStats;
  hosts: Host[];
  // recordingMetadata: RecordingMetadata;
  // roomConfig: RoomConfig;
  // owner: Host;
}

interface RoomConfig {
  id: number;
  roomTitle: string;
  roomDescription: string;
  startTime: string;
  expiryTime: string;
  roomLocked: boolean;
  muteOnEntry: boolean;
  videoOnEntry: boolean;
  tokenType: string;
  chain: string;
  contractAddress: string;
  conditionType: any|null;
  conditionValue: any|null;
  experianceId: number;
}

interface RecordingMetadata {
  id: number;
  chain: any|null;
  tokenType: any|null;
  contractAddress: any|null;
  experianceId: number;
}

interface Host {
  id: number;
  ethAddress: string;
  email: any|null;
  nonce: string;
}

interface ExperianceStats {
  id: number;
  experianceStatus: string;
  totalRatings: number;
  overallRating: number;
  startTime: string;
  expiryTime: string;
  lastMeet: any|null;
  experienceId: number;
}