/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import {MyUser} from "@/services/Common/typings";

export default function access(initialState: { currentUser?: MyUser | undefined }) {
  const { currentUser } = initialState || {};
  return {
    routeFilter: (route:any) => {
      if (!currentUser?.permissions){
        return false
      }
      for (let permission of currentUser?.permissions){
        if (permission.url == route.path || permission.name == route.name){
          return true
        }
      }
      return false
    }
    //routeFilter: true
  };
}
