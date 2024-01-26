import React, {useEffect, useState} from 'react';
import {ModalForm, ProForm, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import {get, postOss} from "@/utils/orzHttp";
import type {DefaultOptionType} from 'rc-select/lib/Select';
import {Button, Image, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import OrzFormUploadButton from "@/pages/compoments/OrzFormUploadButton";
import {FORM_TYPE} from "@/pages/Demo/download/typings";

export type UpdateFormProps = {
  formRef?: any;
  title?: string;
  onCancel: () => void;
  onSubmit?: (value: any, imgageUrl: any) => Promise<void>;
  visible?: boolean;
  values?: any;
  readOnly?: boolean;
};

let industries: DefaultOptionType[] = [];      //行业
let registerOrgs: DefaultOptionType[] = [];    //登记机关

const From: React.FC<UpdateFormProps> = (props) => {

  useEffect(()=>{
    props.formRef?.current?.resetFields();
  })

  const industriesList = async () => {
    let data = { labels: 'HANG_YE', pageSize: 10000 };
    let res = await get('/api/dict/listPage', data)
    for (let dict of res.records) {
      let value: DefaultOptionType = { value: dict.cname, label: dict.name };
      industries.push(value);
    }
  }

  const registerOrgList = async () => {
    let data = { labels: 'REGISTER_ORG', pageSize: 10000 };
    let res = await get('/api/dict/listPage', data)
    for (let registerOrg of res.records) {
      let value: DefaultOptionType = { value: registerOrg.cname, label: registerOrg.name };
      registerOrgs.push(value);
    }
  }


  if (industries.length == 0) {
    industriesList();
  }
  if (registerOrgs.length == 0) {
    registerOrgList();
  }

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
      width="1280px"
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProForm.Group>
        <ProFormText name="id" label="编号" width="xl" hidden />
        <ProFormText rules={[{ required: true, message: '名称为必填项', }]} name="name" label="名称" width="md" disabled={props.readOnly} />
        <ProFormText name="sort" label="信用编码" width="md" disabled={props.readOnly} />
        <ProFormText name="addr" label="企业地址" width="md" disabled={props.readOnly} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="fund" label="注册资金(元)" width="sm" disabled={props.readOnly} />
        <ProFormText name="legalRepresentative" label="法定代表人" width="sm" disabled={props.readOnly} />
        <ProFormText name="phone" label="联系电话" width="sm" disabled={props.readOnly} />
        <ProFormSelect
          width="md"
          options={registerOrgs}
          name="registrationAuthority"
          label="登记机关"
          disabled={props.readOnly}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width="md"
          options={[
            {
              value: 1,
              label: '小微企业',
            },
            {
              value: 9,
              label: '个体工商户',
            },
          ]}
          name="type"
          label="企业类型"
          disabled={props.readOnly}
        />
        <ProFormSelect
          width="md"
          options={[
            {
              value: 1,
              label: '经营中',
            },
            {
              value: 2,
              label: '歇业中',
            },
            {
              value: 3,
              label: '无此企业',
            },
          ]}
          name="status"
          label="企业状态"
          disabled={props.readOnly}
        />
        <ProFormSelect
          width="md"
          options={industries}
          name="industry"
          label="所属行业"
          disabled={props.readOnly}
        />
      </ProForm.Group>
      <ProForm.Group>
        <OrzFormUploadButton
          disabled={props.readOnly}
          label="营业执照"
          max={2}   //最多传2张照片
          name="businessLicenseUrl"
          maxFileSize={2} //最大文件大小2MB
        />
      </ProForm.Group>
    </ModalForm>
  );
};

export default From;
