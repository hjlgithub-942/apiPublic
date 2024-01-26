import React, { useEffect } from 'react';
import { ModalForm, ProForm, ProFormText, ProFormTextArea, } from '@ant-design/pro-form';
import { Permission, FORM_TYPE } from "./typings";

export type UpdateFormProps = {
  formRef?: any;
  formType?: FORM_TYPE;
  onCancel: () => void;
  onSubmit?: (value: any) => Promise<void>;
  visible?: boolean;
  values?: Permission;
};

function getFormTitle(formType?: FORM_TYPE) {
  switch (formType) {
    case FORM_TYPE.ADD:
      return '新建'
    case FORM_TYPE.EDIT:
      return '修改'
    case FORM_TYPE.VIEW:
      return '查看'
  }
  return ''
}


const From: React.FC<UpdateFormProps> = (props) => {
  const onVisibleChange = (value: boolean) => {
    if (!value) {
      props.onCancel()
    }
  }

  useEffect(() => {
    if (!props || !props.visible) {
      return
    }
    if (props.values) {
      props.formRef?.current?.setFieldsValue(props.values)
    }
    else {
      props.formRef?.current?.resetFields()
    }
  }, [props.values, props.visible])

  return (
    <ModalForm
      formRef={props.formRef}
      title={getFormTitle(props.formType)}
      width="800px"
      modalProps={{
        destroyOnClose: true,
      }}
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProFormText name="id" label="编号" width="xl" hidden />
      <ProFormText name="parentId" label="父级id" width="xl" hidden />
      {
        props.formType != FORM_TYPE.EDIT && props.values && props.values.parentId &&
        <ProFormText name="parentName" label="父级菜单" width="xl" disabled />
      }
      <ProForm.Group>
        <ProFormText rules={[{ required: true, message: '名称为必填项' }]} name="name" label="名称" width="xl" disabled={props.formType == FORM_TYPE.VIEW} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText rules={[{ required: true, message: '链接为必填项（无请输入 #）', }]} name="url" label="链接地址（无请输入 #）" width="xl" disabled={props.formType == FORM_TYPE.VIEW} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="perms" label="授权" width="md" disabled={props.formType == FORM_TYPE.VIEW} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="sort" label="排序" width="md" disabled={props.formType == FORM_TYPE.VIEW} />
        {/* <ProFormText name="parentId" label="父级ID"  width="sm" disabled={props.formType == FORM_TYPE.VIEW}/> */}
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea name="descr" label="内容描述" width="xl" disabled={props.formType == FORM_TYPE.VIEW} />
      </ProForm.Group>

    </ModalForm>
  );
};

export default From;
