export type User = {
  id: number
  ethAddress: string
  email: string | null
  nonce: string
}

export type Recordings = {
  id: number;
  recTitle: string;
  recDescription: string;
  dateRecorded: string;
}[]

export interface RecordingResponse {
  recMetadata: RecMetadata;
  recording: BaseRecording|null;
  recContractId: number;
}

interface BaseRecording {
  id: number;
  recTitle: string;
  recDescription: string;
  dateRecorded: string;
  url: string;
}

interface RecMetadata {
  id: number;
  chain: string;
  tokenType: string;
  contractAddress: string;
  tokenGatedRecording: boolean;
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

export interface ICreateExperience
{
  expTitle: string;
  expDescription?: string;
  participantsAllowed?: number;
  tokenGatedRoom: boolean;
  tokenGatedRecording: boolean;
  startTime:string;
  endTime:string;
  hosts: string[];
  recordingMetadata: {
    chain?: string;
    tokenType?: string;
    contractAddress?: string;
  };
  roomConfig: {
    roomLocked: boolean;
    muteOnEntry: boolean;
    videoOnEntry: boolean;
    tokenType?: string;
    chain?: string;
    contractAddress?: string;
    conditionType?: string;
    conditionValue?: string;
  }
}

export interface IRoomCreation
{
  tokenGatedRecording: boolean;
  recordingMetadata: RecordingMetadatad;
  roomConfig: RoomConfigd;
  expTitle: string;
  tokenGatedRoom: boolean;
  expDescription: string;
  startTime: string;
  expiryTime: string;
  participantsAllowed: number;
  hosts: string[]
}

interface RoomConfigd
{
  roomLocked: boolean;
  videoOnEntry: boolean;
  muteOnEntry: boolean;
  tokenType: string;
  chain: string;
  contractAddress: string;
}

interface RecordingMetadatad
{
  tokenType: string;
  chain: string;
}

export enum Chain {
  ETHEREUM = "ETHEREUM",
  COSMOS = "COSMOS",
  SOLANA = "SOLANA",
  TEZOS = "TEZOS",
  BSC = "BSC",
  FILECOIN_HYPERSPACE = "FILECOIN_HYPERSPACE"
}

export enum TokenType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
  SPL = "SPL",
  BEP20 = "BEP20",
  REC20 = "REC20"
}

export interface RoomConfig {
  id: number;
  roomTitle: string;
  roomDescription: string;
  startTime: string;
  expiryTime: string;
  roomLocked: boolean;
  muteOnEntry: boolean;
  videoOnEntry: boolean;
  tokenType: TokenType;
  chain: Chain;
  contractAddress: string;
  conditionType?:"FOLLOW_HANDLE"|"HAVE_HANDLE"|null,
  conditionValue?:string|null
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



export interface CreateIFrameRoom {
  title:string,
  description?:string,
  startTime?:string,
  endTime?:string,
  hostWallets?:string[],
  roomLocked:boolean,
  muteOnEntry:boolean,
  videoOnEntry:boolean
}

export interface CreateTokenGatedIFrameRoom extends CreateIFrameRoom{
  tokenType:TokenType,
  chain:Chain,
  contractAddress:string[]
  conditionType?:"FOLLOW_HANDLE"|"HAVE_HANDLE",
  conditionValue?:string
}
