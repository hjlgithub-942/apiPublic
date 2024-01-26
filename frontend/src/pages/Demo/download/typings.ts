export type DemoPojo = {
  id: number,
  del: number;
  addTime: Date;
  upTime: string;
  name: string;
  img?: string //图片地址，多个图片用,分割
};

export enum FORM_TYPE {
  ADD,
  EDIT,
  VIEW,
}

