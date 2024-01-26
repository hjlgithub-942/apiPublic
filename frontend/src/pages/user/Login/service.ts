import {get, postJson, setToken} from "@/utils/orzHttp";
import {LoginInput, LoginOutput} from "@/pages/user/Login/typings";

/**
 * 登录接口
 */

export async function apiLogin(body: LoginInput, options?: { [key: string]: any }) {
  let result = await postJson<LoginOutput>('/api/login', body, options)
  setToken(result.token)
  return result
}


/** 退出登录接口  */
export async function apiLogout() {
  setToken()
  localStorage.removeItem('password')
}

/**
 * 获取验证码图片接口
 */
export async function apiValiCode() :Promise<{base64:string}>{
  return get<{base64:string}>('/api/valiCode', false)
}
