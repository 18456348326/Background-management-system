// 这个模块主要获取的是品牌管理的数据的模块
import request from '@/utils/request'


//获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => { return request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' }) }




export const reqChangeTradeMarkList = (trademark) => {
  if (trademark.id) {
    // 修改品牌列表
    // /admin/product/baseTrademark/update  携带三个参数：需要修改的品牌的id 品牌名称和品牌logo地址
    return request({ url: '/admin/product/baseTrademark/update', data: trademark, method: 'put' })
  } else {
    // 添加品牌列表
    // /admin/product/baseTrademark/save     携带两个参数：品牌名称和品牌logo的地址 不需要传id 
    return request({ url: "/admin/product/baseTrademark/save ", data: trademark, method: 'post' })
  }
}


//删除商品列表
// /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMarkList = (id) => {
  return request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
}