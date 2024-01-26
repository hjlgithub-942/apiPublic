import React, {useEffect} from 'react';
import {post, get, getTable, postJson} from "@/utils/orzHttp";
import type { CheckboxOptionType } from 'antd/lib/checkbox';
import {
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimePicker, ModalForm, ProForm,
} from '@ant-design/pro-form';


export type UpdateFormProps = {
  formRef?:any;
  title?:string;
  onCancel: () => void;
  onSubmit?: (value:any) => Promise<void>;
  visible?: boolean;
  values?: any;
  readOnly?: boolean;
};

let groupLeaders:CheckboxOptionType[] = [];
let groupPersons:CheckboxOptionType[] = [];

const From: React.FC<UpdateFormProps> = (props) => {
  /*
  const userList = async () =>{
    let res = await get('/api/user/system/admin/getUserList', {injectRoles: true})
    let users = res.records;
    groupLeaders = [];
    groupPersons = [];
    for(let user of users){
      if(user.departmentId&&user.departmentId>0){
        if(props.values&&props.values.id){  //更新操作
          if(user.departmentId!=props.values.id){//  如果用户已经绑定团队，则不能在进行绑定操作
            continue;
          }
        }else{  //添加操作
          continue;
        }
      }
      for(let role of user.roles){
        if(role.kkey=='GROUP_MANAGE'){
          let kv:CheckboxOptionType = {value: user.id, label: user.nickname};
          groupLeaders.push(kv)
        }else  if(role.kkey=='CLIENT_MANAGE'){
          let kv:CheckboxOptionType = {value: user.id, label: user.nickname};
          groupPersons.push(kv);
        }
      }
    }
    console.log(groupLeaders);
    console.log(groupPersons);
  }
  */

  const userList = async () =>{
    let res = await get('/api/user/system/admin/getUserList', {injectRoles: true})
    let users = res.records;
    groupLeaders = [];
    groupPersons = [];
    for(let user of users){
      for(let role of user.roles){
        if(role.kkey=='GROUP_MANAGE'){
          let kv:CheckboxOptionType = {value: user.id, label: user.nickname};
          groupLeaders.push(kv)
        }else  if(role.kkey=='CLIENT_MANAGE'){
          let kv:CheckboxOptionType = {value: user.id, label: user.nickname};
          groupPersons.push(kv);
        }
      }
    }
    console.log(groupLeaders);
    console.log(groupPersons);
  }

  userList();

  useEffect(()=>{
    props.formRef?.current?.resetFields();
    if(props.visible){
      userList();
    }
  })
  const onVisibleChange = (value:boolean)=>{
    if (!value){
      props.onCancel()
    }
  }

  useEffect(()=>{
    if (!props){
      return
    }
    props.formRef?.current?.resetFields()
    if (props.values){
      props.formRef?.current?.setFieldsValue(props.values)
    }
  }, [props.values])

  return (
    <ModalForm
      formRef={props.formRef}
      title={props.title}
      width="800px"
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProForm.Group>
        <ProFormText name="id" label="编号" width="xl" hidden/>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText rules={[{required: true,message: '名称为必填项',}]} name="name" label="部门名称" width="xl" disabled={props.readOnly}/>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
            name="leaderIds"
            layout="horizontal"
            label="领导"
            options={groupLeaders}
          />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
            name="personIds"
            layout="horizontal"
            label="成员"
            options={groupPersons}
          />
      </ProForm.Group>
    </ModalForm>
  );
};

export default From;
