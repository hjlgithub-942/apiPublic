class EventEmitter {
    callback:Function[] = []

    addCallback(func:Function){
        this.callback.push(func)
    }

    removeCallback(func:Function){
        const index = this.callback.indexOf(func);
        if (index > -1) {
            this.callback.splice(index, 1);
        }
    }

    addAutoRemoveCallback(func:Function){
        this.addCallback(func)
        return () => {
            this.removeCallback(func)
        }
    }

    emit(...args: any[]){
        for (let f of this.callback){
            f(...args)
        }
    }
}
//
// class EventBus {
//     events
//
//     constructor() {
//         this.events = this.events || new Object();
//     }
//
//     emit (type, ...args) {
//         let e;
//         e = this.events[type];
//         // 查看这个type的event有多少个回调函数，如果有多个需要依次调用。
//         if (Array.isArray(e)) {
//             for (let i = 0; i < e.length; i++) {
//                 e[i].apply(this, args);
//             }
//         } else {
//             e[0].apply(this, args);
//         }
//     }
// }

export default EventEmitter
