import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Dropdown, Menu, Space, Tag, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import {post, get, getTable, postJson} from "@/utils/orzHttp";
import {TableData} from "@/services/Common/typings";
import {SortOrder} from "antd/lib/table/interface";
import Form from "./Form";

const Notice: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [isRevise, setIsRevise] = useState<boolean>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();

  const apiList = async (params: any,  sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) =>{
    if(!params){
      params={};
    }
    params.type=20;
    let res = await getTable('/api/notice/sys/getList', params, sort, filter);
    let data = res.data;
    let result:TableData = {data:[], page:1, success:true, total:0};
    result.data = data.records;
    result.total = data.total;
    result.page = data.current;
    return result;
  }

    /**
   * 点击新增按钮
   */
     const onClickAdd = () => {
      if (FormRef.current) {
        FormRef.current.resetFields();
      }
      console.log(FormRef.current);

      console.log(">>>>>>新增");
      setReadOnly(false);
      setTitle('新建')
      let record: any = { rentType: 1 };
      setCurrentRow(record);
      setIsRevise(false)
      setModalVisible(true)
    }

    /**
     * 点击删除按钮
     */
     const upStatus = async (record: any, status: number) => {
      Modal.confirm({
        title: '发布/取消操作',
        content: `你确认发布/取消操作吗？`,
        onOk: async () => {
          console.log(">>>>>>发布/取消操作");
          let result = await postJson('/api/notice/upStatus', { id: record.id, status:status })
          console.log(result)
          actionRef.current?.reloadAndRest?.();
        }
      })
    }

    /**
     * 点击删除按钮
     */
    const onClickDelete = async (record: any) => {
      Modal.confirm({
        title: '删除内容',
        content: `你确认删除吗？`,
        onOk: async () => {
          console.log(">>>>>>删除");
          let result = await postJson('/api/notice/del', { id: record.id })
          console.log(result)
          actionRef.current?.reloadAndRest?.();
        }
      })
    }

  /**
 * 表格确认提交
 */
   const onFormSubmit = async (value: any, startTime: any, endTime: any) => {
    if(startTime&&startTime!=''){
      value.startTime = startTime;
    }
    if(endTime&&endTime!=''){
      value.endTime = endTime;
    }
    console.log(value);
    //只读为true 则表示查看详情不需要提交表单
    if (readOnly) {
      setModalVisible(false);
      return;
    }
    if (isRevise) {
      await postJson('/api/notice/sys/edit', value)
      message.success('修改成功');
    } else {
      await postJson('/api/notice/sys/add', value)
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

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '公告名称',
      dataIndex: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: '公告内容',
      dataIndex: 'content',
      ellipsis: true,
      tip: '内容过长会自动收缩',
      search: false,
    },
    {
      title: '公告范围',
      dataIndex: 'scope',
      ellipsis: true,
      valueType: 'select',
      width: 110,
      search: false,
      valueEnum: {
        0: { text: '全国'},
        1: { text: '省级'},
        2: { text: '地级'},
        3: { text: '县级'},
        4: { text: '乡级'},
        5: { text: '村级'},
        6: { text: '组级'},
        20: { text: '系统级'},
        30: { text: '机构级'},
        31: { text: '机构部门级'},
        40: { text: '标签级-机构'},
        41: { text: '标签级-用户'},
      },
    },
    {
      title: '接收方',
      width: 160,
      dataIndex: 'receiver',
      search: false,
      // valueType: 'dateTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      valueType: 'select',
      width: 110,
      valueEnum: {
        0: { text: '新建'},
        1: { text: '审核通过'},
        2: { text: '审核未通过'},
        9: { text: '已发布'},
      },
    },
    {
      title: '生效时间',
      width: 160,
      dataIndex: 'startTime',
      valueType: 'dateTime',
    },
    {
      title: '失效时间',
      width: 160,
      dataIndex: 'endTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '创建时间',
      width: 160,
      dataIndex: 'addTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 130,
      render: (text, record, _, action) => {
        if(record.status!=9){
          return [
            <a key='upStatus' onClick={()=>upStatus(record, 9)}>发布</a>,
            <a key='del' onClick={()=>onClickDelete(record)}>删除</a>,
          ]
        }else{
          return [
            <a key='upStatus' onClick={()=>upStatus(record, 0)}>取消发布</a>,
            <a key='del' onClick={()=>onClickDelete(record)}>删除</a>,
          ]
        }
      }
    }
  ];

    return (
      <PageContainer>
        <Form
          visible={modalVisible}
          title={title}
          onSubmit={onFormSubmit}
          onCancel={onFormCancel}
          values={currentRow}
          formRef={FormRef}
          readOnly={readOnly}
        />
        <ProTable
          columns={columns}
          actionRef={actionRef}
          cardBordered
          request={apiList}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            onChange(value) {
              console.log('value: ', value);
            },
          }}
          rowKey="id"
          search={{
            labelWidth: 'auto',
            defaultCollapsed: false,
            collapsed: false
          }}
          form={{
            span:4
          }}
          toolBarRender={() => [
            <Button onClick={onClickAdd} key="button" icon={<PlusOutlined />} type="primary">
              新建公告
            </Button>,
          ]}
        />
      </PageContainer>
    );
}
export default Notice;
