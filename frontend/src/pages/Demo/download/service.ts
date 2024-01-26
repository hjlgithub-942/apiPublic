import {getTable, postJson, download} from "@/utils/orzHttp";
import {SortOrder} from "antd/lib/table/interface";
import React from "react";
import {DemoPojo} from "./typings";

/** 获取列表*/
export async function apiList(params: { [key: string]: any },  sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) {
  return getTable<DemoPojo>('/api/demo/listPage', params, sort, filter);
}

/** 添加 */
export async function apiAdd(data: { [key: string]: any }) {
  return postJson('/api/demo/add', data);
}

/** 修改 */
export async function apiUpdate(data: { [key: string]: any }) {
  return postJson('/api/demo/edit', data);
}

/** 删除 */
export async function apiRemove(data: { ids: number[] }) {
  return postJson('/api/demo/dels', data);
}

/** 导出excel */
export async function apiListExcel(data: { [key: string]: any }) {
  return download('/api/demo/export', data);
}
