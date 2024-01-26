import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = 'AACCZZ'

  const currentYear = new Date().getFullYear();

  return (
      <DefaultFooter
          copyright={`${currentYear} ${defaultMessage}`}
      />
  );
};

export default Footer;
