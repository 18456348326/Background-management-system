// 平台属性管理模块的请求
import request from '@/utils/request'

// 获取一级分类的数据接口
// /admin/product/getCategory1
export const reqCategoryList1 = () => request({ url: '/admin/product/getCategory1', method: 'get' })


// 获取二级分类的数据接口
// /admin/product/getCategory2/{category1Id}
export const reqCategoryList2 = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" })

// 获取三级分类的数据接口
// /admin/product/getCategory3/{category2Id}
export const reqCategoryList3 = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" })