import { request } from 'umi';
import type { RequestConfig } from 'umi';
import { Context, RequestOptionsInit } from "umi-request";
import {message, notification, UploadProps} from "antd";
import { history } from "@@/core/history";
import * as queryString from "querystring";
import { SortOrder } from "antd/lib/table/interface";
import React from "react";
import {TableData} from "@/services/Common/typings";
import {AxiosResponse} from "axios";
const urlencode = require('urlencode')

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

const loginPath = '/user/login';
export function jumpLogin(){
  if (history.location.pathname != loginPath){
    history.push(loginPath);//获取失败跳转登录页
  }
}

const DEFAULT_ERROR_PAGE = '/exception';
let _token: any = localStorage.getItem('token') as string
interface ErrorInfoStructure {
  success: boolean;
  data?: any;
  errorCode?: string;
  errorMessage?: string;
  showType?: ErrorShowType;
  traceId?: string;
  host?: string;
  [key: string]: any;
}

export interface RequestError extends Error {
  data?: any;
  info?: ErrorInfoStructure;
  request?: Context['req'];
  response?: Context['res'];
}

// 请求前置拦截 携带token
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const newOptions: RequestOptionsInit = { ...options, interceptors: true }
  if (_token) {
    const authHeader = { ...options.headers } as Record<string, string>;
    authHeader.token = _token || ""
    newOptions.headers = authHeader
  }
  return {
    url: `${url}`,
    options: newOptions
  };
};

const responseHandler = (res: AxiosResponse) :AxiosResponse=> {
  console.log('responseHandler', res.data)
  // 拦截响应数据，进行个性化处理
  //原本的错误处理移动到errorHanlder里了，这里不需要了
  return res
}

const errorHandler = (error: RequestError, options:any) => {
  // @ts-ignore
  if (options?.skipErrorHandler) {
    throw error;
  }
  let errorInfo: ErrorInfoStructure | undefined;
  if (error.name === 'ResponseError' && error.data && error.request) {
    const ctx: Context = {
      req: error.request,
      res: error.response,
    };
    errorInfo = error.data, ctx;
    error.message = errorInfo?.errorMessage || error.message;
    error.data = error.data;
    error.info = errorInfo;
  }
  errorInfo = error.info;
  console.log(error)

  if (errorInfo) {
    const errorMessage = errorInfo?.errorMessage;
    const errorCode = errorInfo?.errorCode;
    const errorPage = DEFAULT_ERROR_PAGE;

    switch (errorInfo?.showType) {
      case ErrorShowType.SILENT:
        // do nothing
        break;
      case ErrorShowType.WARN_MESSAGE:
        message.warning(errorMessage);
        break;
      case ErrorShowType.ERROR_MESSAGE:
        message.error(errorMessage);
        break;
      case ErrorShowType.NOTIFICATION:
        notification.open({
          description: errorMessage,
          message: errorCode,
        });
        break;
      case ErrorShowType.REDIRECT:
        // @ts-ignore
        history.push({
          pathname: errorPage,
          // query: { errorCode, errorMessage },
        });
        // redirect to error page
        break;
      default:
        message.error(errorMessage);
        break;
    }
  } else {
    message.error(error.message || '网络请求异常');
  }
  // throw error;
}

const errorThrower = (errorInfo: ErrorInfoStructure) => {
  console.log('errorThrower')
  if (errorInfo.success === false) {
    // 抛出错误到 errorHandler 中处理
    if (errorInfo?.errorCode == '500001'){
      jumpLogin()
      return
    }

    const error: RequestError = new Error(errorInfo.errorMessage);
    error.name = 'BizError';
    error.data = errorInfo.data;
    error.info = errorInfo;
    throw error;
  }
}
export const requestConfig: RequestConfig = {
  errorConfig: {
    errorThrower,
    errorHandler
  },
  requestInterceptors: [authHeaderInterceptor],//添加
  // responseInterceptors: [responseHandler]
};


export const setToken = (token?: string) => {
  _token = token
  if (token) {
    localStorage.setItem('token', token)
  }
  else {
    localStorage.removeItem('token')
  }
}

export const getToken = () => {
  return _token
}

export const get = async <T>(url: string, data: any, options?: { [key: string]: any }):Promise<T> => {
  if (data) {
    url += '?' + queryString.stringify(data)
  }

  const result = await request(url, {
    method: 'GET',
    ...(options || {}),
  })
  return result.data
}

/**
 * @param url 地址
 * @param data 参数
 * @param filename 下载后的文件名，如果传空则使用服务端的文件名
 * @param options
 */
export const download = async (url: string, data: any, filename?:string, options?: { [key: string]: any }) => {
  if (data) {
    url += '?' + queryString.stringify(data)
  }
  options = {...options} || {}
  options.responseType = 'blob'
  options.getResponse = true
  options.method = 'GET'
  // console.log(options)
  const result = await request(url, options)
  const blob = result.data
  if (blob.type.toLowerCase().indexOf('application/json') >= 0 ){
    //接口出错了
    let buffer = await blob.arrayBuffer()
    let utf8decoder = new TextDecoder()
    let json = JSON.parse(utf8decoder.decode(buffer))
    if (!json.success && json.errorMessage){
      message.error(json.errorMessage);
    }
    return
  }



  const contentDisposition = result.headers['content-disposition']
  // console.log(result.data)

  console.log(contentDisposition)
  if (contentDisposition && contentDisposition.indexOf('filename*=UTF-8\'\'') > 0){
    // attachment; filename="????????.xlsx"; filename*=UTF-8''%E5%AE%A2%E6%88%B7%E7%94%B3%E8%B5%8E%E5%AF%BC%E5%85%A5%E6%A0%B7%E8%A1%A8.xlsx
    filename = contentDisposition.substring(contentDisposition.indexOf('filename*=UTF-8\'\'') + 'filename*=UTF-8\'\''.length)
    filename = urlencode.decode(filename)
    // console.log(filename)
  }
  else if (contentDisposition && contentDisposition.indexOf('filename=') > 0){
    filename = contentDisposition.substring(contentDisposition.indexOf('filename=') + 'filename='.length)
    // filename = new Buffer(filename, 'base64').toString('utf8')
  }

  const aLink = document.createElement('a')
  document.body.appendChild(aLink)
  aLink.style.display='none'
  const objectUrl = window.URL.createObjectURL(result.data)
  aLink.href = objectUrl
  aLink.download = filename || 'file'
  aLink.click()
  document.body.removeChild(aLink)
}

export const getTable = async <T>(url: string, params: any, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>):Promise<TableData<T>> => {
  const data = await get<{records:T[], total:number, current:number }>(url, { ...params, sort: JSON.stringify(sort), filter: JSON.stringify(filter) })
  let result:TableData<T> = {data:[], page:1, success:true, total:0};
  result.data = data.records;
  result.total = data.total;
  result.page = data.current;
  return result
}

export const post = async <T>(url: string, data: any, options?: { [key: string]: any }):Promise<T> => {
  const result = await request(url, {
    method: 'POST',
    // requestType: 'form',
    data,
    ...(options || {}),
  })
  return result.data
}
export const postOss = async (url: string, data: any, options?: { [key: string]: any }):Promise<string> => {
  const result = await request(url, {
    method: 'POST',
    requestType: 'form',
    data,
    ...(options || {}),
  })
  return result.data
}

export const postJson = async <T>(url: string, data: any, options?: { [key: string]: any }) => {
  const result = await request(url, {
    method: 'POST',
    requestType: 'json',
    data,
    ...(options || {}),
  })
  return result.data
}

export type UploadOptions = {
  onProgress?:()=>void
  onSuccess?:()=>void
  onFail?:()=>void
}

export const getUploadFileProps = (options?:UploadOptions): UploadProps=>{
  const uploadprops: UploadProps = {
    name: 'file',
    headers: {
      token: _token || "",
    },
    onChange(info: any) {
      // console.log('info', info)
      if (info.file.status === 'uploading') {
        // console.log(info.file, info.fileList, '正在上传');
        options?.onProgress && options.onProgress()
      }
      if (info.file.status === 'done') {
        const result = info.file.response
        // console.log(result)
        if (result.success){
          options?.onSuccess && options.onSuccess()
          message.success(result.data?.msg || '文件上传成功！');
        }
        else{
          options?.onFail && options.onFail()
          message.error(info.file.response.errorMessage || '文件上传失败！');
        }
      } else if (info.file.status === 'error') {
        options?.onFail && options.onFail()
        message.error('文件上传失败！');
        // console.log('上传失败')
      }
    },
  };
  return uploadprops
}
