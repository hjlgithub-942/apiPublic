import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { get, getTable, postJson } from "@/utils/orzHttp";
import Form from "./Form";
import SettingPermissionFrom from "./SettingPermissionFrom";
import { SortOrder } from "antd/lib/table/interface";

const Role: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [isRevise, setIsRevise] = useState<boolean>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();
  const [modalVisibleSettingPermissionFrom, setModalVisibleSettingPermissionFrom] = useState<boolean>(false);

  const apiList = async (params: { [key: string]: any }, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
    return getTable('/api/role/getForPageRoleList', params, sort, filter);
  }


  const settingPermission = async (record: any) => {
    try {
      const getDetail: any = await get('/api/role/getRoleDetail', { id: record.id })
      let _record = { ...getDetail }
      _record.roleId = record.id;
      _record['permissionIds'] = record?.permissions?.map((item: any) => Number(item.id))
      setCurrentRow({ ..._record });
      setModalVisibleSettingPermissionFrom(true)
    } catch (error) {
      console.log(error, '获取角色详情错误')
    }
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
  const onClickDelete = async (record: any) => {
    Modal.confirm({
      title: '删除内容',
      content: `你确认删除吗？`,
      onOk: async () => {
        console.log(">>>>>>删除");
        let result = await postJson('/api/role/delRoles', { ids: [record.id] })
        console.log(result)
        actionRef.current?.reloadAndRest?.();
      }
    })
  }

  /**
   * 点击修改按钮
   */
  const onClickUpdate = (record: any) => {
    console.log(">>>>>>修改");
    setReadOnly(false);
    setTitle('修改')
    setIsRevise(true)
    setCurrentRow(record);
    setModalVisible(true)
  }

  /**
   * 点击详情按钮
   */
  const onClickDetail = (record: any) => {
    console.log(">>>>>>详情");
    setReadOnly(true);
    setTitle('详情')
    setIsRevise(true)
    setCurrentRow(record);
    setModalVisible(true)
  }

  /**
   * 表格确认提交
   */
  const onFormSubmit = async (value: any) => {
    console.log("表单提交");
    console.log(value);
    //只读为true 则表示查看详情不需要提交表单
    if (readOnly) {
      setModalVisible(false);
      return;
    }
    if (isRevise) {
      await postJson('/api/role/updateRole', value)
      message.success('修改成功');
    } else {
      await postJson('/api/role/addRole', value)
      message.success('添加成功');
    }
    setModalVisible(false);
    actionRef.current?.reload()
  }

  /**
   * 账户设置角色
   * @param value
   * @returns
   */
  const onFormSubmitForBindPermissions = async (value: any) => {
    try {
      let result = await postJson('/api/role/bindPermissions', value)
      setModalVisibleSettingPermissionFrom(false);
      actionRef.current?.reload()
      message.success('绑定菜单成功')
    } catch (error) {

    }
  }

  /**
   * 表格取消
   */
  const onFormCancel = () => {
    setModalVisible(false);
    setModalVisibleSettingPermissionFrom(false);
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
      title: '唯一码',
      dataIndex: 'kkey',
      ellipsis: true,
      tip: '此值唯一，不能重复',
    },
    {
      disable: true,
      title: '描述',
      dataIndex: 'descr',
      ellipsis: true,
      tip: '菜单描述过长会自动收缩',
      search: false,
    },
    {
      title: '首页地址',
      dataIndex: 'indexPage',
      ellipsis: true,
      tip: '链接过长会自动收缩',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a key='upData' onClick={() => onClickUpdate(record)}>修改</a>,
        <a key='detailData' onClick={() => onClickDetail(record)}>查看</a>,
        <a key='settingPermission' onClick={() => settingPermission(record)}>绑定菜单</a>,
        <a key='delData' style={{ color: 'red' }} onClick={() => onClickDelete(record)}>删除</a>,
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
      <SettingPermissionFrom
        visible={modalVisibleSettingPermissionFrom}
        onSubmit={onFormSubmitForBindPermissions}
        onCancel={onFormCancel}
        title='绑定角色'
        values={currentRow}
        formRef={FormRef}
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
          pageSize: 10,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="角色管理"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={onClickAdd}>
            新建
          </Button>
        ]}
      />
    </PageContainer>
  );
}
export default Role;
