import { RequestError } from '@/utils/orzHttp';
import { LockOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Alert, Form, Input, message, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import useStyles from './index.style';
import { apiLogin, apiValiCode } from '@/pages/user/Login/service';
import { LoginInput } from '@/pages/user/Login/typings';
import orzUtils from "@/utils/orzUtils";

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const { styles } = useStyles();
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [loginError, setLoginError] = useState<string>('');
  const [captchaUrl, setCaptchaUrl] = useState<string>('');
  const myForm = useRef<any>();

  useEffect(() => {
    refreshCaptcha();
    const userName =
      localStorage.getItem('userName') == null
        ? ''
        : window.atob(localStorage.getItem('userName') as any);
    const password =
      localStorage.getItem('password') == null
        ? ''
        : window.atob(localStorage.getItem('password') as any);
    const remember = password != '';
    myForm?.current?.setFieldsValue({ userName, password, remember });
  }, []);

  const fetchUserInfo = async () => {
    const userInfo: any = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
    return userInfo;
  };
  const refreshCaptcha = async () => {
    try {
      const img = await apiValiCode();
      setCaptchaUrl('data:image/png;base64,' + img.base64);
    } catch (error) {
      console.log(error, '获取验证码失败')
    }
  };
  const handleSubmit = async (values: LoginInput) => {
    let success: boolean = false;
    try {
      let pares: LoginInput = { ...values };
      delete pares.remember;
      // 登录
      await apiLogin(pares, { skipErrorHandler: true });
      message.success('登录成功！');
      success = true;
      await fetchUserInfo();
      await orzUtils.delay(0) //一定要加这个，不然currentUser会还没有设置好，变成空
      history.push('/sys_admin/index');
    } catch (error) {
      refreshCaptcha();
      const e = error as RequestError;
      console.log(e.stack)
      setLoginError(e.message.toString());
    }

    localStorage.setItem('userName', window.btoa(values.userName));
    if (values.remember && success) {
      localStorage.setItem('password', window.btoa(values.password));
    } else {
      localStorage.removeItem('password');
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm<LoginInput>
          // logo={<img alt="logo" src={'LOGD_IMG'} />}
          title="Demo管理平台"
          subTitle={'Demo管理平台'}
          formRef={myForm}
          onFinish={async (values) => {
            //表单提交方法
            await handleSubmit(values);
          }}
        >
          <Tabs centered activeKey={type} onChange={setType}
            //5.0升级改动这里由Tab.TabPane改为items
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />//className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />

              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />// className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />

              <Form.Item
                className="formpwdItem"
                name="code"
                rules={[{ required: true, message: '请填写验证码！' }]}
              >
                <div>
                  {/*className={styles.getCode}>*/}
                  <Input
                    style={{ width: '70%' }}
                    size="large"
                    prefix={<SafetyCertificateOutlined />}
                    className="formInput"
                    placeholder="请输入验证码"
                  />
                  &nbsp;
                  <img style={{ width: '28%' }} src={captchaUrl} onClick={refreshCaptcha} />
                </div>
              </Form.Item>
              {loginError && <LoginMessage content={loginError} />}

              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <ProFormCheckbox noStyle name="remember">
                  记住密码
                </ProFormCheckbox>
              </div>
            </>
          )}
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
