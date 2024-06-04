// orderMappings.ts

// 定义订单项的类型
export interface OrderItem {
  payment_method: 'credit_card' | 'alipay' | 'wechat' | 'paypal';
  payment_status: 'unpaid' | 'success' | 'failed';
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
}

// 定义映射函数
export const getPaymentMethodInChinese = (method: OrderItem['payment_method']): string => {
  const paymentMethodMap: Record<OrderItem['payment_method'], string> = {
    credit_card: '信用卡',
    alipay: '支付宝',
    wechat: '微信支付',
    paypal: '贝宝',
  };
  return paymentMethodMap[method];
};

export const getPaymentStatusInChinese = (status: OrderItem['payment_status']): string => {
  const paymentStatusMap: Record<OrderItem['payment_status'], string> = {
    unpaid: '未支付',
    success: '成功',
    failed: '失败',
  };
  return paymentStatusMap[status];
};

export const getOrderStatusInChinese = (status: OrderItem['status']): string => {
  const orderStatusMap: Record<OrderItem['status'], string> = {
    pending: '待处理',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  };
  return orderStatusMap[status];
};
