import axios from "axios"

const baseURL = "http://localhost:5000"
const api = axios.create({
  baseURL,
  withCredentials:true
})

export async function userExsists(ethAddress:string){
  const {data} = await api.get<boolean>(`/exists/users?ethAddress=${ethAddress}`)
  return data
}