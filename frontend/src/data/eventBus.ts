import EventEmitter from "./eventEmitter";

class CEventBus {
    eventDic:any = {}

    addEventListener(eventName:string, func:Function){
        if (!this.eventDic[eventName]){
            this.eventDic[eventName] = new EventEmitter()
        }
        this.eventDic[eventName].addCallback(func)
    }

    removeEventListener(eventName:string, func: Function){
        if (!this.eventDic[eventName]){
           return
        }
        this.eventDic[eventName].removeCallback(func)
        if (this.eventDic[eventName].callback.length == 0){
            delete this.eventDic[eventName]
        }
    }

    addAutoRemoveEventListener(eventName:string, func:Function){
        this.addEventListener(eventName, func)
        return () => {
            this.removeEventListener(eventName, func)
        }
    }

    emit(eventName:string, ...args: any[]){
        if (!this.eventDic[eventName]){
            return
        }
        this.eventDic[eventName].emit(...args)
    }
}
const EventBus = new CEventBus()
export default EventBus
