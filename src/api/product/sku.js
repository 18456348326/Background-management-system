// sku 
import request from '@/utils/request'

// 获取skulist数据
// /admin/product/list/{page}/{limit}
export const reqGetSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })



// 上架的接口
// /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })





// 下架的接口
// /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })



// 获取sku详细信息的接口
// /admin/product/getSkuById/{skuId}
export const reqGetSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' })



