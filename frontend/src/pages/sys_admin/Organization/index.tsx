import {DownloadOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, message, Modal, notification, Upload, UploadProps} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {get, getTable, postJson} from "@/utils/orzHttp";
import Form from "./Form";
import {SortOrder} from "antd/lib/table/interface";
import UserIndex from '../User/index';
import DepartmentIndex from '../Department/index';

const Organization: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [readOnly, setReadOnly] = useState<boolean>(false);
  const [title, setTitle] = useState<string>();
  const [isRevise, setIsRevise] = useState<boolean>();
  const [currentRow, setCurrentRow] = useState();
  const FormRef = useRef<any>();
  const [valueModel, setvalueModel] = useState('')
  const [recodeId, setrecodeId] = useState('')
  const [modelsVisible, setModelsVisible] = useState(false)
  const [industries, setIndustries] = useState([])

  const [userManageVisible, setUserManageVisible] = useState(false);
  const [departmentManageVisible, setDepartmentManageVisible] = useState(false);
  const [choseOrganizationId, setChoseOrganizationId] = useState(0);

  const industriesList = async () => {
    let data = {labels: 'HANG_YE', pageSize: 10000};
    let res = await get('/api/dict/listPage', data)
    let temp: any = [];
    for (let dict of res.records) {
      let value = {value: dict.cname, label: dict.name};
      temp.push(value);
    }
    setIndustries(temp);
  }

  useEffect(() => {
    industriesList();
  }, [])

  const apiList = async (params: { [key: string]: any }, sort: Record<string, SortOrder>, filter: Record<string, React.ReactText[] | null>) => {
    params.needPerAcreTax = true;
    params.injectYearRevenueRecord = true;
    return getTable('/api/org/getOrgList', params, sort, filter);
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
    let record: any = {rentType: 1};
    setCurrentRow(record);
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
        let result = await postJson('/api/org/delOrgs', {ids: [record.id]})
        console.log(result)
        actionRef.current?.reloadAndRest?.();
      }
    })
  }

  /**
   * 点击用户管理
   */
  const onClickManageUser = async (record: any) => {
    setChoseOrganizationId(record.id)
    setUserManageVisible(true);
  }

  /**
   * 点击修改按钮
   */
  const onClickUpdate = (record: any) => {
    if (FormRef.current) {
      FormRef.current.resetFields();
    }
    console.log(">>>>>>修改");
    setReadOnly(false);
    setTitle('修改')
    setIsRevise(true)
    record.times = [record.rentStartTime, record.rentEndTime]
    setCurrentRow(record);
    setModalVisible(true)
  }

  /**
   * 点击详情按钮
   */
  const onClickDetail = (record: any) => {
    if (FormRef.current) {
      FormRef.current.resetFields();
    }
    console.log(">>>>>>详情");
    setReadOnly(true);
    setTitle('详情')
    setIsRevise(true)
    record.times = [record.rentStartTime, record.rentEndTime]
    setCurrentRow(record);
    setModalVisible(true)
  }

  /**
   * 表格确认提交
   */
  const onFormSubmit = async (value: any) => {
    if (value.times) {
      if (value.times.length == 2) {
        value.rentStartTime = new Date(value.times[0]);
        value.rentEndTime = new Date(value.times[1]);
      } else if (value.times.length == 1) {
        value.rentStartTime = new Date(value.times[0]);
      }
    }
    delete value.uploadResponse;
    // console.log(value);
    //只读为true 则表示查看详情不需要提交表单
    if (readOnly) {
      setModalVisible(false);
      return;
    }
    if (isRevise) {
      await postJson('/api/org/updateOrg', value)
      message.success('修改成功');
    } else {
      await postJson('/api/org/addOrg', value)
      message.success('添加成功');
    }
    setModalVisible(false);
    actionRef.current?.reload()
  }
  // 模板导出
  const onClickExport = async () => {
    let aa = document.createElement('a');
    aa.href = '/api/org/exportModel'
    aa.innerHTML = '';
    aa.download = '导入模板.xlsx';
    aa.style.display = 'none'; //隐藏a标签 直接调用a标签的点击事件
    document.body.appendChild(aa);
    aa.click();
    document.body.removeChild(aa)
    actionRef.current?.reloadAndRest?.();
  }
  // 模板导出
  const onClickExportExcel = async () => {
    let aa = document.createElement('a');
    aa.href = '/api/org/export?needPerAcreTax=true'
    aa.innerHTML = '';
    aa.download = '导入模板.xlsx';
    aa.style.display = 'none'; //隐藏a标签 直接调用a标签的点击事件
    document.body.appendChild(aa);
    aa.click();
    document.body.removeChild(aa)
    actionRef.current?.reloadAndRest?.();
  }
  const Uploadprops: UploadProps = {
    showUploadList: false,
    name: 'file',
    action: '/api/org/excelUpload',
    // data: {
    //   type: 0
    // },
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList, '正在上传');
      }
      if (info.file.status === 'done') {
        if (info.file.response.state == 'true') {
          notification['success']({
            message: '文件上传成功！',
            description:
              '',
          });
          actionRef.current?.reloadAndRest?.();
        } else {
          notification['error']({
            message: '文件上传失败！',
            description: info.file.response.state,
          });
        }
        console.log('上传完成')
      } else if (info.file.status === 'error') {
        console.log('上传失败')
      }
    },
  };

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
      title: '名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '行业',
      dataIndex: 'industry',
      ellipsis: true,
      valueType: 'select',
      fieldProps: {
        options: industries
      },
    },
    {
      title: '法定代表人',
      dataIndex: 'legalRepresentative',
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      ellipsis: true,
      search: false,
      width: 100,
    },
    {
      title: '企业位置',
      dataIndex: 'addr',
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 250,
      render: (text, record, _, action) => [
        <a key='manageUser' onClick={() => onClickManageUser(record)}>账号管理</a>,
        <a key='upData' onClick={() => onClickUpdate(record)}>修改</a>,
        <a key='detailData' onClick={() => onClickDetail(record)}>查看</a>,
        <a key='delData' onClick={() => onClickDelete(record)}>删除</a>,
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
      <Modal
        title="机构账号管理"
        centered
        visible={userManageVisible}
        width={1300}
        onOk={() => setUserManageVisible(false)}
        onCancel={() => setUserManageVisible(false)}
        footer={null}
      >
        <UserIndex organizationId={choseOrganizationId}/>
      </Modal>
      <Modal
        title="机构部门管理"
        centered
        visible={departmentManageVisible}
        width={1300}
        onOk={() => setDepartmentManageVisible(false)}
        onCancel={() => setDepartmentManageVisible(false)}
        footer={null}
      >
        <DepartmentIndex organizationId={choseOrganizationId}/>
      </Modal>
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
          span: 4,
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
          //onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="企业管理"
        toolBarRender={() => [
          // <a key="button" type="primary" href='/api/org/export?needPerAcreTax=true' target="_blank">
          //   导出EXCEL
          // </a>,
          <Button onClick={onClickExportExcel} key="button" icon={<DownloadOutlined/>} type="primary">
            导出EXCEL
          </Button>,
          <Upload {...Uploadprops}>
            <Button key="button" icon={<UploadOutlined/>} type="primary">
              导入企业
            </Button>
          </Upload>,
          <Button onClick={onClickExport} key="button" icon={<DownloadOutlined/>} type="primary">
            导出模板
          </Button>,
          <Button key="button" icon={<PlusOutlined/>} type="primary" onClick={onClickAdd}>
            添加企业
          </Button>
        ]}
      />
    </PageContainer>
  );
}
export default Organization;
