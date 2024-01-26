import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, message, Modal} from 'antd';
import React, {useRef, useState} from 'react';
import {getTable, post, postJson} from "@/utils/orzHttp";
import {TableData} from "@/services/Common/typings";
import Form from "./Form";
import {SortOrder} from "antd/lib/table/interface";

const Department: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [title,setTitle]=useState<string>();
  const [isRevise,setIsRevise]=useState<boolean>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();

  // const apiList = async (params: any,  sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) =>{
  //   let res = await getTable('/api/dept/getDeptList', params, sort, filter);
  //   let data = res.data;
  //   let result:TableData = {data:[], page:1, success:true, total:0};
  //   result.data = data.records;
  //   result.total = data.total;
  //   result.page = data.current;
  //   return result;
  // }

  const apiList = async (params: { [key: string]: any }, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
    return getTable('/api/dept/getDeptList', params, sort, filter);
  }

  /**
   * 点击新增按钮
   */
  const onClickAdd = () => {
    console.log(">>>>>>新增");
    setReadOnly(false);
    setTitle('新建')
    setCurrentRow(undefined);
    setIsRevise(false)
    setModalVisible(true)
  }

  /**
   * 点击删除按钮
   */
  const onClickDelete = async (record:any) => {
    Modal.confirm({
      title: '删除内容',
      content: `你确认删除吗？`,
      onOk: async () => {
        console.log(">>>>>>删除");
        let result = await postJson('/api/dept/delDepts', {ids: [record.id]})
        console.log(result)
        actionRef.current?.reloadAndRest?.();
      }
    })
  }

  /**
   * 点击修改按钮
   */
  const onClickUpdate = (record:any) => {
    console.log(">>>>>>修改");
    setReadOnly(false);
    setTitle('修改')
    setIsRevise(true)

    setCurrentRow(record);
    setModalVisible(true)
  }

    /**
   * 表格确认提交
   */
  const onFormSubmit = async (value:any)=>{
    console.log("表单提交");
    console.log(value);
    //只读为true 则表示查看详情不需要提交表单
    if(readOnly){
      setModalVisible(false);
      return;
    }
    if (isRevise){
      await postJson('/api/dept/updateDept', value)
      message.success('修改成功');
    }else{
      await postJson('/api/dept/addDept', value)
      message.success('修改成功');
    }
    setModalVisible(false);
    actionRef.current?.reload()
  }

  /**
    * 表格取消
    */
  const onFormCancel = ()=>{
    setModalVisible(false);
  }

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
      tip: '名称过长会自动收缩',
    },
    {
      title: '领导',
      dataIndex: 'leader',
      ellipsis: true,
      search: false,
      render: (text, record, _, action) => {
        if(!record.leaders||record.leaders.length==0){
          return '-';
        }
        let str = '';
        for(let user of record.leaders){
          str += user.nickname + ',';
        }
        str = str.substring(0, str.length-1);
        return str;
      }
    },
    {
      title: '成员',
      dataIndex: 'users',
      ellipsis: true,
      search: false,
      render: (text, record, _, action) => {
        if(!record.persons||record.persons.length==0){
          return '-';
        }
        let str = '';
        for(let user of record.persons){
          str += user.nickname + ',';
        }
        str = str.substring(0, str.length-1);
        return str;
      }
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a key='upData' onClick={()=>onClickUpdate(record)}>修改</a>,
        <a key='delData' onClick={()=>onClickDelete(record)}>删除</a>,
      ],
    },
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
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            onChange: (page) => console.log(page),
          }}
          dateFormatter="string"
          headerTitle="部门管理"
          toolBarRender={() => [
            <Button key="button" icon={<PlusOutlined />} type="primary" onClick={onClickAdd}>
              新建
            </Button>
          ]}
        />
      </PageContainer>
    );
}
export default Department;
