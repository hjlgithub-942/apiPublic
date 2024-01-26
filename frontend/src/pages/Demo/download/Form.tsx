import React, {useEffect} from 'react';
import {ModalForm, ProForm, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import {DemoPojo, FORM_TYPE} from "./typings";
import OrzFormUploadButton from "@/pages/compoments/OrzFormUploadButton";

export type UpdateFormProps = {
  formRef?:any;
  formType?:FORM_TYPE;
  onCancel: () => void;
  onSubmit?: (value:any) => Promise<void>;
  visible?: boolean;
  values?: DemoPojo;
};

function getFormTitle(formType?:FORM_TYPE){
  switch(formType){
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
  // const [_, setImageUrl] = useState('')

  const onVisibleChange = (value:boolean)=>{
    if (!value){
      props.onCancel()
    }
  }

  useEffect(()=>{
    if (!props || !props.visible){
      return
    }
    if (props.values){
      props.formRef?.current?.setFieldsValue(props.values)
    }
    else{
      props.formRef?.current?.resetFields()
    }
  }, [props.values, props.visible])

  return (
    <ModalForm
      formRef={props.formRef}
      title={getFormTitle(props.formType)}
      width="800px"
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProFormText name="id" label="编号" width="xl" hidden/>
      <ProForm.Group>
        <ProFormText rules={[{required: true, message: '请填写名称'}]} name="name" label="名称" width="xl" disabled={props.formType == FORM_TYPE.VIEW}/>
      </ProForm.Group>

      <ProForm.Group>
        <ProFormTextArea name="descr" label="内容描述" width="xl" disabled={props.formType == FORM_TYPE.VIEW}/>
      </ProForm.Group>
      <ProForm.Group>
          <OrzFormUploadButton
            disabled={props.formType == FORM_TYPE.VIEW}
            label="图片上传demo"
            max={2}   //最多传2张照片
            name="img"
            maxFileSize={2} //最大文件大小2MB
          />
      </ProForm.Group>

    </ModalForm>
  );
};

export default From;
