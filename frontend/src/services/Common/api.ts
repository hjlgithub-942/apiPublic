// @ts-ignore
/* eslint-disable */
import {get} from "@/utils/orzHttp";
import {MyUser} from "@/services/Common/typings";


/** 登录接口 POST /api/login/getMyUser */
export async function apiGetMyUser(options?: { [key: string]: any }) {
  let result:any = await get('/api/user/getUserDetail', {}, options)
  let myUser:MyUser = {token:result.token, roles: result.roles};
  myUser.permissions = result.permissions;
  myUser.name = result.nickname;
  return myUser
}


/** url获取参数  */
export function getUrlParams(url: string, key:string) {
  let params = url.replace('?', '').split('&');
  for(let param of params){
    let kvs = param.split('=');
    if(kvs[0]==key){
      return kvs[1];
    }
  }
  return;
}
