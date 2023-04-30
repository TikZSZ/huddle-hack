import axios from "axios"
import type { User } from "./types"

const baseURL = "http://localhost:5000"
const api = axios.create({
  baseURL,
  withCredentials:true
})


export async function getNonce(ethAddress:string){
  const {data} = await api.get<{nonce:string}>(`/users/${ethAddress}/nonce`)
  return data.nonce
}

export async function loginUser(ethAddress:string,data:{nonce:string,signature:string}){
  const {data:resp} = await api.post<{user:User,token:string}>(`/users/${ethAddress}/login`,data)
  return resp
}

export async function verifyUser(){
  const {data:resp} = await api.post<User>(`/users/verifyUser`)
  return resp
}