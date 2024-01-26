export type Permission = {
  id: number,
  del: number;
  addTime: Date;
  upTime: string;
  name: string;
  descr:string
  url:string
  tip:string
  parentId:number
};

export enum FORM_TYPE  {
  ADD,
  EDIT,
  VIEW,
}

