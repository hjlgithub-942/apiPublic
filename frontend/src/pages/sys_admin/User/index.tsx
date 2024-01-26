import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { get, getTable, post, postJson } from "@/utils/orzHttp";
import Form from "./Form";
import { SortOrder } from "antd/lib/table/interface";

let roles: any = [];

const User: React.FC<{ organizationId: number }> = (props) => {
  console.log(props);
  const actionRef: any = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalVisibleSettingRoleFrom, setModalVisibleSettingRoleFrom] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [isRevise, setIsRevise] = useState<boolean>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();

  useEffect(() => {
    roleList();
    actionRef.current.reload();
  })

  const roleList = async () => {
    let res = await get('/api/role/getRoleList', {})
    roles = res;
    console.log(roles);
  }

  // const apiList = async (params: any,  sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) =>{
  //   params.injectRoles = true;
  //   if(props.organizationId&&props.organizationId!=0){
  //     params.organizationId = props.organizationId;
  //   }
  //   let res = await getTable('/api/user/system/admin/getUserList', params, sort, filter);
  //   let data = res.data;
  //   let result:TableData = {data:[], page:1, success:true, total:0};
  //   result.data = data.records;
  //   result.total = data.total;
  //   result.page = data.current;
  //   return result;
  // }

  const apiList = async (params: { [key: string]: any }, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
    params.injectRoles = true;
    if (props.organizationId && props.organizationId != 0) {
      params.organizationId = props.organizationId;
    }
    return getTable('/api/user/system/admin/getUserList', params, sort, filter);
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
        let result = await postJson('/api/user/delUsers', { ids: [record.id] })
        console.log(result)
        actionRef.current?.reloadAndRest?.();
      }
    })
  }

  /**
 *
 * @param record 激活
 */
  const onClickActivate = async (record: any) => {
    Modal.confirm({
      title: '激活账户',
      content: `你确认冻激活账户吗？`,
      onOk: async () => {
        console.log(">>>>>>激活");
        let result = await postJson('/api/user/activateUser', { id: record.id })
        console.log(result)
        actionRef.current?.reloadAndRest?.();
      }
    })
  }

  /**
   *
   * @param record 冻结
   */
  const onClickFrozen = async (record: any) => {
    Modal.confirm({
      title: '冻结账户',
      content: `你确认冻结该账户吗？`,
      onOk: async () => {
        console.log(">>>>>>冻结");
        let result = await postJson('/api/user/frozenUser', { id: record.id })
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
    record['roleIds'] = record?.roles?.map((item: any) => Number(item.id));
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
    if (props.organizationId && props.organizationId != 0) {
      value.organizationId = props.organizationId;
    }
    //只读为true 则表示查看详情不需要提交表单
    if (readOnly) {
      setModalVisible(false);
      return;
    }
    if (isRevise) {
      await postJson('/api/user/updateUser', value)
      message.success('修改成功');
    } else {
      await postJson('/api/user/addUser', value)
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
    setModalVisibleSettingRoleFrom(false);
  }

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '名称',
      dataIndex: 'username',
      ellipsis: true,
      tip: '名称过长会自动收缩',
    },
    {
      disable: true,
      title: '昵称',
      dataIndex: 'nickname',
      ellipsis: true,
      tip: '菜单描述过长会自动收缩',
      search: false,
    },
    {
      disable: true,
      title: '角色',
      dataIndex: 'roleId',
      ellipsis: true,
      search: false,
      render: (text, record, _, action) => {
        console.log(record);
        let roleLabels = '';
        if (record.roles && record.roles.length > 0) {
          for (let role of record.roles) {
            roleLabels = roleLabels + role.name + ' / '
          }
          roleLabels = roleLabels.substring(0, roleLabels.length - 2);
        } else {
          roleLabels = '-'
        }
        return roleLabels;
      }
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      ellipsis: true,
      search: false,
      render: (text, record, _, action) => {
        if (record.status == 1) {
          return <span style={{ color: 'green' }}>激活</span>
        } else {
          return <span style={{ color: 'red' }}>冻结</span>
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        if (record.status == 1) {
          return [
            <a key='upData' onClick={() => onClickUpdate(record)}>修改</a>,
            <a key='detailData' onClick={() => onClickDetail(record)}>查看</a>,
            <a key='frozenData' onClick={() => onClickFrozen(record)} style={{ color: 'red' }}>冻结</a>,
            <a key='delData' onClick={() => onClickDelete(record)}>删除</a>,
          ]
        } else {
          return [
            <a key='upData' onClick={() => onClickUpdate(record)}>修改</a>,
            <a key='detailData' onClick={() => onClickDetail(record)}>查看</a>,
            <a key='activateData' onClick={() => onClickActivate(record)} style={{ color: 'green' }}>激活</a>,
            <a key='delData' onClick={() => onClickDelete(record)}>删除</a>,
          ]
        }
      },
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
          span: 8,
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
        headerTitle="账户管理"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={onClickAdd}>
            新建
          </Button>
        ]}
      />
    </PageContainer>
  );
}
export default User;
