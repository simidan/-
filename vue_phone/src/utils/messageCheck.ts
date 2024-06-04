import { userMessage } from "./interface";

interface loginInfo {
  phone: string;
  password: string;
}
export function validateLoginInfo(loginInfo: loginInfo) {
  // 检查是否为空
  if (!loginInfo.phone || !loginInfo.password) {
      return { isValid: false, errorMessage: '电话和密码不能为空' };
  }

  // 验证电话号码格式
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!phonePattern.test(loginInfo.phone)) {
      return { isValid: false, errorMessage: '请输入有效的手机号.' };
  }

  // 验证密码复杂性
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/
  if (!passwordPattern.test(loginInfo.password)) {
    return { isValid: false, errorMessage: '请输入6到15位，至少一个字母，一个数字和一个特殊字符的密码' };
  }

  // 如果所有检查都通过
  return { isValid: true, errorMessage: '' };
}


interface registerInfo extends Omit<userMessage, 'avatar'|'full_name'|'default_address'> {}
export function validateRegisterInfo(info: registerInfo) {
  // 检查是否为空
  if (!info.username || !info.password || !info.phone || !info.email || !info.gender || !info.birthday) {
      return { isValid: false, errorMessage: '不能有信息为空' };
  }

  // 验证电话号码格式
  const phonePattern = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (!phonePattern.test(info.phone)) {
      return { isValid: false, errorMessage: '请输入有效的手机号.' };
  }

  // 验证邮箱格式
  const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailPattern.test(info.email)) {
      return { isValid: false, errorMessage: '请输入有效的邮箱地址.' };
  }

  // 验证密码复杂性
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,15}$/;
  if (!passwordPattern.test(info.password)) {
      return { isValid: false, errorMessage: '密码应为6到15位，且包含至少一个字母和一个数字.' };
  }

  // 验证生日格式
  const birthdayPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!birthdayPattern.test(info.birthday)) {
      return { isValid: false, errorMessage: '生日格式不正确，正确格式为 YYYY-MM-DD.' };
  }
  // 如果所有检查都通过
  return { isValid: true, errorMessage: '' };
}