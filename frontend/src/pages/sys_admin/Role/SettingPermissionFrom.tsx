import React, { useEffect, useState } from 'react';
import { get } from "@/utils/orzHttp";
import { ModalForm, ProForm, ProFormCheckbox, ProFormText, } from '@ant-design/pro-form';
import type { CheckboxOptionType } from 'antd/lib/checkbox';
import { Tree } from "antd";
import type { DataNode, TreeProps } from 'antd/es/tree';


export type UpdateFormProps = {
  formRef?: any;
  title?: string;
  onCancel: () => void;
  onSubmit?: (value: any) => Promise<void>;
  visible?: boolean;
  values?: any;
};

let permissions: CheckboxOptionType[] = [];
let treeData: DataNode[] = [];
let serverPermissions: any[] = [];

function integratedMenuName(arr: any[]) {
  for (let i of arr) {
    i['labelName'] = i.name + '【' + i.descr + '】'
    if (i.list.length > 0) {
      integratedMenuName(i.list)
    }
  }
  return arr
}

const roleList = async () => {
  let res: any = await get('/api/menu/getMenuList', {})
  treeData = integratedMenuName(res);
  // permissions = [];
  // serverPermissions = res;
  // for (let menu of res) {
  //   let roleValue: CheckboxOptionType = { value: menu.id, label: menu.name };
  //   let roleTreeValue: DataNode = { title: menu.name, key: menu.id };
  //   permissions.push(roleValue);
  //   treeData.push(roleTreeValue);
  // }
}

const SettingPermissionFrom: React.FC<UpdateFormProps> = (props: any) => {
  if (props.values && props.values.permissions) {
    props.values.permissionIds = [];
    for (let chosePermission of props.values.permissions) {
      for (let permission of serverPermissions) {
        if (chosePermission.id == permission.id) {
          props.values.permissionIds.push(permission.id)
        }
      }
    }
  }

  useEffect(() => {
    roleList();
  }, [])

  const onVisibleChange = (value: boolean) => {
    if (!value) {
      props.onCancel()
    }
  }

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['1', '2']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['1', '2']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const [currentMenuKeyList, setCurrentMenuKeyList] = useState<any>([])//当前选中菜单id
  const [lastcurrentMenuKeyList, setlastcurrentMenuKeyList] = useState<any>([])//当前选中菜单id 包含父节点  当没有全选父节点的时候 加入父节点id 最后传出去的值
  const [lastcurrentMenuKeyListNofirst, setlastcurrentMenuKeyListNofirst] = useState<any>([])//当前选中菜单id  未全选时 不包含父节点  前端回显用 

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys: any, info: any) => {
    //！！ 不是全选子节点的时候 把父节点加进去  info.halfCheckedKeys 会返回父节点
    // 全选子节点 会自动加入父节点
    setCurrentMenuKeyList([...checkedKeys])

    props.formRef?.current?.setFieldsValue({ permissionIds: [...checkedKeys, ...info.halfCheckedKeys as any] })
    props.formRef?.current?.setFieldsValue({ remark: checkedKeys.toString() })

    setlastcurrentMenuKeyList([...checkedKeys, ...info.halfCheckedKeys as any])
    setlastcurrentMenuKeyListNofirst([...checkedKeys])
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };


  useEffect(() => {
    if (!props) {
      return
    }
    props.formRef?.current?.resetFields()


    if (props.values && props.values.remark) {
      let _currentMenuKeyList = props.values.remark?.split(',') || []
      _currentMenuKeyList = _currentMenuKeyList.map((num: any) => Number(num))
      setCurrentMenuKeyList([..._currentMenuKeyList])
    } else {
      setCurrentMenuKeyList([])
    }
    if (props.values) {
      props.formRef?.current?.setFieldsValue(props.values)
    }
  }, [props.values, props.visible])

  return (
    <ModalForm
      formRef={props.formRef}
      title={props.title}
      width="800px"
      visible={props.visible}
      onVisibleChange={onVisibleChange}
      onFinish={props.onSubmit}
      initialValues={props.values}
    >
      <ProFormText name="remark" label="无父级id回显值" width="xl" hidden />
      <ProForm.Group>
        <ProFormText name="roleId" label="角色编号" width="xl" disabled={true} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
          name="permissionIds"
          layout="horizontal"
          label="菜单选择"
          options={permissions}
        />
      </ProForm.Group>
      <Tree
        checkable
        defaultExpandAll={true}
        onSelect={onSelect}
        checkedKeys={[...currentMenuKeyList]}
        onCheck={onCheck}
        fieldNames={
          {
            title: 'labelName',
            key: 'id',
            children: 'list'
          }
        }
        treeData={treeData}
      />
    </ModalForm>
  );
};

export default SettingPermissionFrom;
