import React, {useEffect, useState} from 'react';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormDateTimePicker, 
  ModalForm, 
  ProForm,
  ProFormDateRangePicker
} from '@ant-design/pro-form';
import { DatePicker} from 'antd';
const { RangePicker } = DatePicker;

export type UpdateFormProps = {
  formRef?:any;
  title?:string;
  onCancel: () => void;
  onSubmit?: (value:any, startTime:any, endTime:any) => Promise<void>;
  visible?: boolean;
  values?: {};
  readOnly?: boolean;
};

const From: React.FC<UpdateFormProps> = (props) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(()=>{
    props.formRef?.current?.resetFields();
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
      onFinish={(e) => props.onSubmit(e, startTime, endTime)}
      initialValues={props.values}
    >
      <ProForm.Group>
        <ProFormText name="id" label="编号" width="xl" hidden/>
        <ProFormText name="startTime" label="开始时间" width="xl" hidden/>
        <ProFormText name="endTime" label="结束时间" width="xl" hidden/>
        <ProFormText rules={[{required: true,message: '名称为必填项',}]} name="title" label="公告名称" width="xl" disabled={props.readOnly}/>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea name="content" label="内容描述" width="xl" disabled={props.readOnly}/>
      </ProForm.Group>
      <ProForm.Group>
      <ProFormSelect
          width="sm"
          options={[
            {
              value: 20,
              label: '系统级',
            },
            {
              value: 30,
              label: '机构级',
            },
            {
              value: 31,
              label: '机构部门级',
            },
            {
              value: 40,
              label: '标签级-机构',
            },
            {
              value: 41,
              label: '标签级-用户',
            },
          ]}
          name="scope"
          label="公告范围"
          disabled={props.readOnly}
          
        />



        
          {/* <ProFormSelect
          width="sm"
          options={[
            {
              value: 20,
              label: '系统级',
            },
            {
              value: 30,
              label: '机构级',
            },
            {
              value: 31,
              label: '机构部门级',
            },
            {
              value: 40,
              label: '标签级-机构',
            },
            {
              value: 41,
              label: '标签级-用户',
            },
          ]}
          name="receiver"
          label="接收方"
          disabled={props.readOnly}
          // hidden = {scope===30?false:true}
        /> */}

      </ProForm.Group>
      <ProForm.Group>
        <RangePicker showTime onChange = {(date, dateString)=>{  setStartTime(dateString[0]); setEndTime(dateString[1])}}/>
      </ProForm.Group>
    </ModalForm>
  );
};

export default From;
