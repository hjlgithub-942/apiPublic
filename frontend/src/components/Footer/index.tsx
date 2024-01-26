import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = '浙江奥智数字科技有限公司出品'

  const currentYear = new Date().getFullYear();

  return (
      <DefaultFooter
          copyright={`${currentYear} ${defaultMessage}`}
      />
  );
};

export default Footer;
