import {useEffect, useRef} from "react";
import {message} from "antd";
import {MessageType} from "antd/lib/message/interface";
import {useRequest} from "ahooks";


export function useDelayLoading(request: any, options?: { [key: string]: any }) {
    options = options || {}
    const r = useRequest(request, { loadingDelay: 500, manual: true, onError :()=>{}, ...options})
    const hide = useRef<MessageType>()

    useEffect(() => {
        if (r.loading) {
          hide.current = message.loading('请稍候');
        }
        else {
          if (hide.current){
            hide.current()
          }
        }
    }, [r.loading])

    return r;
}



