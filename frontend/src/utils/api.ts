import axios from "axios"
import type { CreateIFrameRoom, CreateTokenGatedIFrameRoom, Experience, Experiences, RecordingResponse, Recordings, RoomConfig, User } from "./types"

const baseURL = "http://localhost:5000"
const api = axios.create( {
  baseURL,
  withCredentials: true
} )


export async function getNonce ( ethAddress: string )
{
  const { data } = await api.get<{ nonce: string }>( `/users/${ethAddress}/nonce` )
  return data.nonce
}

export async function loginUser ( ethAddress: string, data: { nonce: string, signature: string } )
{
  const { data: resp } = await api.post<{ user: User, token: string }>( `/users/${ethAddress}/login`, data )
  return resp
}

export async function verifyUser ()
{
  const { data: resp } = await api.post<User>( `/users/verifyUser` )
  return resp
}

export async function getExperiences ()
{
  const { data } = await api.get<Experiences>( `/experiences` )
  return data
}

export async function getExperience ( expId: number )
{
  const { data } = await api.get<Experience>( `/experiences/${expId}` )
  return data
}

export async function getRecordings ( expId: number )
{
  const { data } = await api.get<Recordings>( `/experiences/${expId}/recordings` )
  return data
}

export async function getRecording ( expId: number, recId: number )
{
  const { data } = await api.get<RecordingResponse>( `/experiences/${expId}/recordings/${recId}` )
  return data
}

export async function getRoomConfig ( expId: number )
{
  const { data } = await api.get<RoomConfig>( `/experiences/${expId}/roomConfig` )
  return data
}

export async function initMeet ( expId: number, roomId: string )
{
  const { data } = await api.patch<Experience>( `/experiences/${expId}/initMeet`, { roomId } )
  return data
}

export async function wrapUp ( expId: number )
{
  const { data } = await api.patch<Experience>( `/experiences/${expId}/wrapUp` )
  return data
}


export async function createIFrameRoom ( iframeConfig: CreateIFrameRoom | CreateTokenGatedIFrameRoom )
{
  //VwTZ4AGTxme9snANex9tep3NwvVMGfYd
  const { data } = await api.post<{ message: string, data:{
    roomId:string,meetingLink?:string
  } }>( `https://iriko.testing.huddle01.com/api/v1/create-iframe-room`, { ...iframeConfig }, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': "VwTZ4AGTxme9snANex9tep3NwvVMGfYd",
    },
  } )
  return data
}