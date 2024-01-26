import {PlusOutlined} from '@ant-design/icons';
import type {ActionType} from '@ant-design/pro-components';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, message, Popconfirm, Image, Upload} from 'antd';
import React, {useRef, useState} from 'react';
import Form from "./Form";
import {PageParams} from "@/services/Common/typings";
import {apiAdd, apiList, apiListExcel, apiRemove, apiUpdate} from "./service";
import {DemoPojo, FORM_TYPE} from "./typings";
import {ProTable, ProColumns} from "@ant-design/pro-table";
import {SortOrder} from "antd/lib/table/interface";
import orzUtils from "@/utils/orzUtils";
import {getUploadFileProps} from "@/utils/orzHttp";

const Index: React.FC<{ organizationId: number }> = (props) => {
  const actionRef: any = useRef<ActionType>();
  const [isExportExcel, setIsExportExcel] = useState<boolean>(false)
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formType, setFormType] = useState<FORM_TYPE>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();

  /**
   * 点击新增按钮
   */
  const onClickAdd = () => {
    setCurrentRow(undefined);
    setFormType(FORM_TYPE.ADD)
    setModalVisible(true)
  }

  /**
   * 点击删除按钮
   */
  const onClickDelete = async (record: any) => {
    await apiRemove({ids: [record.id]})
    actionRef.current?.reloadAndRest?.();
    message.success('删除成功');
  }

  /**
   * 点击修改按钮
   */
  const onClickUpdate = (record: any) => {
    setFormType(FORM_TYPE.EDIT)
    setCurrentRow({...record});
    setModalVisible(true)
  }

  /**
   * 点击详情按钮
   */
  const onClickDetail = (record: any) => {
    setFormType(FORM_TYPE.VIEW)
    setCurrentRow({...record});
    setModalVisible(true)
  }

  /**
   * 表格确认提交
   */
  const onFormSubmit = async (value: any) => {
    //只读为true 则表示查看详情不需要提交表单
    if (formType == FORM_TYPE.VIEW) {
      setModalVisible(false);
      return;
    }
    if (formType == FORM_TYPE.EDIT) {
      await apiUpdate(value)
      message.success('修改成功');
    } else {
      await apiAdd(value)
      message.success('添加成功');
    }
    setModalVisible(false);
    actionRef.current?.reload()
  }

  /**
   * 表格取消
   */
  const onFormCancel = () => {
    setModalVisible(false);
  }

  const requestForm = async (params: any, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
    if (isExportExcel) {
      const data = {...params, sort: JSON.stringify(sort), filter: JSON.stringify(filter)}
      setIsExportExcel(false)
      apiListExcel(data)
      throw new Error() //这里抛出异常，不然table会刷成没有数据
    } else {
      return apiList(params, sort, filter)
    }
  }

  const onClickExportExcel = (formProps: any) => {
    setIsExportExcel(true)
    formProps.form.submit()
  }

  const onUploadSuccess = () => {
    actionRef.current?.reload()
  }

  const columns: ProColumns<DemoPojo>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true, //过长自动省略
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      valueType: 'dateTime',
      search: false, //不能搜索
    },
    {
      title: '图片',
      dataIndex: 'img',
      valueType: 'image',
      search: false, //不能搜索
      render: (text, record, _, action) => {
        const url = record.img || ''
        if (!url) {
          return '-'
        }
        let result = []
        let list = url.split(',')
        for (let img of list) {
          result.push(<Image
            height={50}
            src={orzUtils.getThumbUrl(img)}
            preview={{
              src: img,
            }}
          />)
        }

        return result
      }

    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        let result = [
          <a key='upData' onClick={() => onClickUpdate(record)}>修改</a>,
          <a key='detailData' onClick={() => onClickDetail(record)}>查看</a>,
          <Popconfirm key='delData' title="确定要删除吗" onConfirm={() => onClickDelete(record)}> <a href='#'>删除</a></Popconfirm>
        ]
        return result
      },
    },
  ];

  return (
    <PageContainer>
      <Form
        visible={modalVisible}
        onSubmit={onFormSubmit}
        onCancel={onFormCancel}
        values={currentRow}
        formRef={FormRef}
        formType={formType}
      />
      <ProTable<DemoPojo, PageParams>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={requestForm}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          // defaultCollapsed: false,
          // collapsed: false
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button key="out" onClick={() => onClickExportExcel(formProps)}>
              导出Excel
            </Button>,
          ],
        }}
        form={{
          // span: 4,
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            return values;
          },
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        headerTitle="上传下载(点击新建有上传图片的demo)"
        toolBarRender={() => [
          <Upload {...getUploadFileProps({onSuccess: onUploadSuccess})} showUploadList={false} accept='.xlsx,.xls'
                  action='/api/excelUpload'>
            <Button key="button" icon={<PlusOutlined/>} type="primary">
              导入Excel
            </Button>
          </Upload>,
          <Button key="button" icon={<PlusOutlined/>} type="primary" onClick={onClickAdd}>
            新建
          </Button>
        ]}
      />
    </PageContainer>
  );
}
export default Index;
