import React, { useEffect } from 'react';
import { get } from "@/utils/orzHttp";
import { ModalForm, ProForm, ProFormCheckbox, ProFormText, } from '@ant-design/pro-form';
import type { CheckboxOptionType } from 'antd/lib/checkbox';


export type UpdateFormProps = {
  formRef?: any;
  title?: string;
  onCancel: () => void;
  onSubmit?: (value: any) => Promise<void>;
  visible?: boolean;
  values?: any;
  readOnly?: boolean;
};

let roles: CheckboxOptionType[] = [];
let serverRoles: any[] = [];

const roleList = async () => {
  let res: any = await get('/api/role/getRoleList', {})
  roles = [];
  for (let role of res) {
    let roleValue: CheckboxOptionType = { value: role.id, label: role.name };
    roles.push(roleValue);
  }
}

const From: React.FC<UpdateFormProps> = (props) => {
  useEffect(() => {
    roleList();
    props.formRef?.current?.resetFields();
  }, [])

  const onVisibleChange = (value: boolean) => {
    if (!value) {
      props.onCancel()
    }
  }

  useEffect(() => {
    if (!props) {
      return
    }
    props.formRef?.current?.resetFields()
    if (props.values) {
      props.formRef?.current?.setFieldsValue(props.values)
    }
  }, [props.values])

  return (
    <ModalForm
      formRef={props.formRef}
      title={props.title}
      width="800px"
      visible={props.visible}
      modalProps={{
        destroyOnClose: true,
      }}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProForm.Group>
        <ProFormText name="id" label="编号" width="xl" hidden />
        <ProFormText rules={[{ required: true, message: '名称为必填项', }]} name="username" label="名称" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="nickname" label="昵称" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="password" label="密码" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
          name="roleIds"
          layout="horizontal"
          label="角色选择"
          options={roles}
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default From;
