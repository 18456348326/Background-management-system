// spu
import request from '@/utils/request'
//获取spu列表的接口
// /admin/product/{page}/{limit}   get请求  （ page limit 和 第三级id） 这三个参数
export const reqSpuList = (page, limit, id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id: id } })



// 获取spu信息的接口
// /admin/product/getSpuById/{spuId}
export const reqGetSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })



// 获取品牌的数据的接口
// /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })


// 获取spu图片的接口
// /admin/product/spuImageList/{spuId}
export const reqGetSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })



// 获取平台全部销售属性    ----销售属性最多就三个
// /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })



// 添加spu的接口||修改spu的接口   两个数据的区别就是修改spu有id
export const reqUpdateSpu = (spuInfo) => {
  // 参数带有id就是更新数据
  if (spuInfo.id) {
    // 更新spu数据
    // /admin/product/updateSpuInfo
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    // 参数不带id就是添加数据
    // 添加spu数据
    // /admin/product/saveSpuInfo
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}


// 删除spu接口
// /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })




// 获取sku图片的接口
// /admin/product/spuImageList/{spuId}
export const reqGetSkuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })


// 获取销售属性列表
// /admin/product/spuSaleAttrList/{spuId}
export const reqGetSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })


// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrInfoList = (category1Id, category3Id, category2Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })



// 添加sku
// /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo })


// 获取sku列表数据的接口
// /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })