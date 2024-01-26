import { createStyles } from "antd-style";

const useStyles = createStyles(({ token }) => {
  return {
    pre: {
      margin: "12px 0",
      padding: "12px 20px",
      background: token.colorBgContainer,
      boxShadow: token.boxShadow,
    },
  };
});

export default useStyles;
