import axios from 'axios'
import {AuthModel, UserModel} from './_models'

export const GET_USER_BY_ACCESSTOKEN_URL = `auth/get-user`
export const LOGIN_URL = `auth/login`
export const GET_REFRESH_TOKEN_URL = `auth/refresh-token`
export const REGISTER_URL = `auth/sign-up`
export const REQUEST_PASSWORD_URL = `auth/forgot-password`
export const RESET_PASSWORD_URL = `auth/reset-password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  password_confirmation: string,
  role:string,
  avatar:string
) {
  return axios.post(REGISTER_URL, {
    email,
    firstName,
    lastName,
    password,
    password_confirmation,
    role,
    avatar
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function resetPassword(password:string,token:string) {
  return axios.post<{result: boolean}>(RESET_PASSWORD_URL,{password,token})
}


export function getUserByToken() {
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}

export function getRefreshToken(prevAccessToken: string, refreshToken: string) {
  return axios.post<AuthModel>(GET_REFRESH_TOKEN_URL, {
    accessToken: prevAccessToken,
    refreshToken: refreshToken
  },{
    headers:{
      Authorization:'Bearer ' + refreshToken
    }
  })
}
