import { createStyles } from "antd-style";

const useStyles = createStyles(({ token }) => {
  return {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "auto",
      background: token.colorBgLayout,
      [`@media (min-width: ${token.screenMDMin}px)`]: {
        backgroundImage:
          "url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center 110px",
        backgroundSize: "100%",
      },
    },
    lang: {
      width: "100%",
      height: "40px",
      lineHeight: "44px",
      textAlign: "right",
      ".ant-dropdown-trigger": { marginRight: "24px" },
    },
    content: {
      flex: "1",
      padding: "32px 0",
      [`@media (min-width: ${token.screenMDMin}px)`]: {
        padding: "32px 0 24px",
      },
    },
    icon: {
      marginLeft: "8px",
      color: "rgba(0, 0, 0, 0.2)",
      fontSize: "24px",
      verticalAlign: "middle",
      cursor: "pointer",
      transition: "color 0.3s",
      "&:hover": { color: token.colorPrimary },
    },
    login_box: {
      ".ant-input": {
        fontSize: "18px",
        color: "white",
        backgroundColor: "#00144a",
        "&::placeholder": {
          color: "white",
        },
      },
      ".ant-input-password-icon.anticon": {
        color: "rgba(255, 255, 255, 1)",
        cursor: "pointer",
        transition: "all 0.3s",
      },
      ".ant-form-item-explain-error": { fontSize: "15px" },
      position: "relative",
      overflow: "hidden",
      minWidth: "1920px",
      minHeight: "1080px",
      width: "100%",
      height: "100%",
      backgroundSize: "100%",
      backgroundImage: "url(../../../../public/loginBG.png)",
      backgroundRepeat: "no-repeat",
    },
    login_dialog: {
      position: "absolute",
      width: "500px",
      height: "600px",
      top: "50%",
      transform: "translate(0, -50%)",
      right: "200px",
      backgroundColor: "rgba(0, 25, 90, 0.4)",
    },
    login_name: {
      position: "relative",
      top: "60px",
      fontSize: "35px",
      textAlign: "center",
      color: "white",
    },
    login_pwd: {
      display: "flex",
      color: "white",
      padding: "50px 0 0 0",
      justifyContent: "center",
      width: "100%",
      position: "relative",
      top: "60px",
    },
    login_form: {
      width: "85%",
    },
    formInput: {
      fontSize: "18px",
      color: "white",
      border: "none",
      backgroundColor: "#00144a",
      lineHeight: "60px",
    },
    formpwdItem: {
      marginBottom: "20px",
    },
    remebaerBox: {
      position: "relative",
      marginBottom: "60px",
      width: "100%",
      justifyContent: "space-between",
    },
    remebaer: {
      color: "white",
    },
    remebaer1: {
      position: "absolute",
      color: "white",
      right: "0",
    },
    loginbtn: {
      width: "100%",
      fontSize: "20px",
      height: "50px",
    },
  };
});

export default useStyles;
