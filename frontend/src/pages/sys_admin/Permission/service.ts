import {getTable, postJson} from "@/utils/orzHttp";
import {SortOrder} from "antd/lib/table/interface";
import React from "react";
import {Permission} from "./typings";

/** 获取列表*/
export async function apiList(params: { [key: string]: any },  sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) {
  return getTable<Permission>('/api/menu/getForPageMenuList', params, sort, filter);
}

/** 添加 */
export async function apiAdd(data: { [key: string]: any }) {
  return postJson('/api/menu/addMenu', data);
}

/** 修改 */
export async function apiUpdate(data: { [key: string]: any }) {
  return postJson('/api/menu/updateMenu', data);
}

/** 删除 */
export async function apiRemove(data: { ids: number[] }) {
  return postJson('/api/menu/delMenus', data);
}
