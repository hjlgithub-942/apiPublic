import { PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import Form from "./Form";
import { PageParams } from "@/services/Common/typings";
import { apiAdd, apiList, apiRemove, apiUpdate } from "./service";
import { DemoPojo, FORM_TYPE } from "./typings";
import { ProTable, ProColumns } from "@ant-design/pro-table";

const Index: React.FC<{ organizationId: number }> = (props) => {
    const actionRef: any = useRef<ActionType>();
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
        await apiRemove({ ids: [record.id] })
        actionRef.current?.reloadAndRest?.();
        message.success('删除成功');
    }

    /**
     * 点击修改按钮
     */
    const onClickUpdate = (record: any) => {
        setFormType(FORM_TYPE.EDIT)
        setCurrentRow({ ...record });
        setModalVisible(true)
    }

    /**
     * 点击详情按钮
     */
    const onClickDetail = (record: any) => {
        setFormType(FORM_TYPE.VIEW)
        setCurrentRow({ ...record });
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

    const columns: ProColumns<DemoPojo>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '接口名称',
            dataIndex: 'name',
            ellipsis: true, //过长自动省略
        },
        {
            title: '接口地址',
            dataIndex: 'url',
            ellipsis: true, //过长自动省略
        },
        {
            title: '描述',
            dataIndex: 'description',
            ellipsis: true, //过长自动省略
            valueType: 'textarea'
        },
        {
            title: '请求方法',
            dataIndex: 'method',
            ellipsis: true, //过长自动省略
        },
        {
            title: '请求头',
            dataIndex: 'requestHeader',
            ellipsis: true, //过长自动省略
            valueType: 'textarea'
        },
        {
            title: '响应头',
            dataIndex: 'responseHeader',
            ellipsis: true, //过长自动省略
            valueType: 'textarea'
        },
        {
            title: '接口状态',
            dataIndex: 'status',
            ellipsis: true, //过长自动省略
            valueEnum: {
                0: { text: '禁用', status: 'Error' },
                1: { text: '启用', status: 'Success' },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            search: false, //不能搜索
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
                request={apiList}
                editable={{
                    type: 'multiple',
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                    // defaultCollapsed: false,
                    // collapsed: false
                }}
                form={{
                    // span:4,
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 10,
                }}
                dateFormatter="string"
                headerTitle="API接口"
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={onClickAdd}>
                        新建
                    </Button>
                ]}
            />
        </PageContainer>
    );
}
export default Index;
