import { showDialog } from 'vant';

function messageBox (info:string,fun?:Function) {
  showDialog({
    message: info,
  }).then(() => {
    if (fun) {
      fun();
    }
  })
}

export default messageBox