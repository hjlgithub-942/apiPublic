// @ts-ignore
/* eslint-disable */

import {TableListItem} from "@/pages/ApprovalList/data";

export type PageParams = {
  current?: number;
  pageSize?: number;
  keyword?: string;
};

export type TableData<T> = {
  data: T[];
  /** 列表的内容总数 */
  total?: number;
  success?: boolean;
  page?:number;
}

export type SelectValue = {
  value?:any;
  label?:string;
}

export type Role = {
  id:number
  name?:string
  kkey?:string
}

export type Permission = {
  id:number
  url?:string
  name?:string
}

  export type MyUser = {
    token: string;
    name?: string;
    roles: Role[];
    permissions? : Permission[];
  };

  export type ApiResult = {
    code:string;
    msg:string;
    body:any;
  }
