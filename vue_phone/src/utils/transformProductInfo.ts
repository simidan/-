import { Ref } from 'vue';
import { productMessage } from "@/utils/interface";

const excludedKeys = ['image', 'business_id', 'sub_category_id', 'product_id', 'created_at', 'updated_at','status'];

const keyToLabelMap: Record<string, string> = {
  certification: '认证',
  description: '描述',
  grade: '等级',
  harvest_date: '收获日期',
  name: '名称',
  origin: '产地',
  price: '价格',
  safety_standards: '安全标准',
  season: '适宜季节',
  shelf_life: '保质期',
  stock_quantity: '库存数量',
  storage_conditions: '储存条件',
  unit: '单位',
};

const orderOfKeys = [
  'name', 
  'description', 
  'origin', 
  'grade', 
  'harvest_date', 
  'price', 
  'unit', 
  'stock_quantity', 
  'safety_standards', 
  'season', 
  'shelf_life', 
  'storage_conditions',
  'certification',
];

export function transformProductInfo(productInfo: Ref<productMessage | undefined>) {
  if (!productInfo.value) {
    return [];
  }

  return Object.entries(productInfo.value)
    .filter(([key]) => !excludedKeys.includes(key))
    .map(([key, value]) => {
      if (key === 'harvest_date' && typeof value === 'string') {
        value = value.split(' ')[0];
      }

      if (key === 'price' && typeof value === 'number') {
        value = `${value}元`;
      }

      if (key === 'shelf_life' && typeof value === 'number') {
        value = `${value}月`;
      }

      return {
        label: keyToLabelMap[key] || key, 
        value,
        sortOrder: orderOfKeys.indexOf(key),
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ label, value }) => ({ label, value }));
}

