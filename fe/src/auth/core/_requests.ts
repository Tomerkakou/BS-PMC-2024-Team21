import axios from 'axios'
import {AuthModel, UserModel} from './_models'

export const GET_USER_BY_ACCESSTOKEN_URL = `User`
export const LOGIN_URL = `Auth/sign-in`
export const GET_REFRESH_TOKEN_URL = `Auth/refresh-token`
export const REGISTER_URL = `Auth/register`
export const REQUEST_PASSWORD_URL = `Auth/forgot-password`
export const RESET_PASSWORD_URL = `Auth/reset-password`

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
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

export function resetPassword(payload: any) {
  return axios.post<{result: boolean}>(RESET_PASSWORD_URL, payload)
}


export function getUserByToken() {
  return axios.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL)
}

export function getRefreshToken(prevAccessToken: string, refreshToken: string) {
  return axios.post<AuthModel>(GET_REFRESH_TOKEN_URL, {
    accessToken: prevAccessToken,
    refreshToken: refreshToken
  })
}
