// sku 
import request from '@/utils/request'


// 获取图片的接口
// /admin/product/spuImageList/{spuId}
export const reqGetSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })


// 获取销售属性列表
// /admin/product/spuSaleAttrList/{spuId}
export const reqGetSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })


// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrInfoList = (category1Id, category3Id, category2Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })


// /admin/product/saveSkuInfo