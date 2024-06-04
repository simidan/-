import router from "@/router";

const goBack = () => {
  setTimeout(() => { // 使用setTimeout来延迟跳转
    const previousPath = sessionStorage.getItem('previousPath');
    if (previousPath) {
      router.push(previousPath);
    } else {
      router.push('/');
    }
  }, 1000); // 设置延迟为1000毫秒（1秒）
};

export default goBack;