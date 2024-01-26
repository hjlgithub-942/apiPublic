import React, { useEffect } from 'react';
import { ModalForm, ProForm, ProFormText, ProFormTextArea, } from '@ant-design/pro-form';


export type UpdateFormProps = {
  formRef?: any;
  title?: string;
  onCancel: () => void;
  onSubmit?: (value: any) => Promise<void>;
  visible?: boolean;
  values?: {};
  readOnly?: boolean;
};

const From: React.FC<UpdateFormProps> = (props) => {
  const onVisibleChange = (value: boolean) => {
    if (!value) {
      props.onCancel()
    }
  }

  useEffect(() => {
    props.formRef?.current?.resetFields();
  },[])

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
      modalProps={{
        destroyOnClose: true,
      }}
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProForm.Group>
        <ProFormText name="id" label="编号" width="xl" disabled={true} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText rules={[{ required: true, message: '名称为必填项', }]} name="name" label="角色名称" width="xl"
          disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="kkey" label="唯一码" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="indexPage" label="角色首页地址" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea name="descr" label="角色描述" width="xl" disabled={props.readOnly} />
      </ProForm.Group>
    </ModalForm>
  );
};

export default From;
