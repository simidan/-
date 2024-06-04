import { showConfirmDialog } from 'vant';

function messageBoxDialog (info:string,fun?:Function) {
  showConfirmDialog({
    title: '标题',
    message:info,
  })
    .then(() => {
      console.log(fun);
    })
    .catch(() => {
    });
}

export default messageBoxDialog