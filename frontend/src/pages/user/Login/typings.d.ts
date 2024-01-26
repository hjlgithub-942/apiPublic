export  type LoginInput =  {
  userName: string;
  password: string;
  code?:string; //验证码
  remember?:boolean //是否记住密码
};

export type LoginOutput = {
  token: string;
}
