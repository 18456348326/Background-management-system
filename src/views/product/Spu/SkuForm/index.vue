<template>
  <div>
    <el-form label-width='80px'>
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="请输入sku名称"
                  v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)"
                  v-model='skuInfo.price'
                  type='number'></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)"
                  v-model='skuInfo.weight'></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input placeholder="规格描述"
                  type="textarea"
                  :rows="4"
                  v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline='true'
                 label-width='80px'>
          <el-form-item :label="item1.attrName"
                        v-for="(item1,index) in attrInfoList"
                        :key="item1.id">
            <el-select placeholder="请选择"
                       v-model="item1.attrIdAndvalueId">
              <el-option :value='`${item1.id}:${item2.id}`'
                         :label='item2.valueName'
                         v-for="(item2,index) in item1.attrValueList"
                         :key="item2.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline='true'
                 label-width='80px'>
          <el-form-item :label="item1.saleAttrName"
                        v-for="(item1,index) in saleAttrList"
                        :key="item1.id">
            <el-select placeholder="请选择"
                       v-model="item1.saleIdAndValueId">
              <el-option :value='`${item1.id}:${item2.id}`'
                         :label='item2.saleAttrValueName'
                         v-for="(item2,index) in item1.spuSaleAttrValueList"
                         :key="item2.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border
                  :data='spuImageList'
                  @selection-change="handleSelectionChange">
          <el-table-column type='selection'></el-table-column>
          <el-table-column label='图片'>
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl"
                   style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column label='名称'
                           prop='imgName'></el-table-column>
          <el-table-column label='操作'>
            <template slot-scope="{row,$index}">
              <el-button type="primary"
                         v-if="!row.isDefault"
                         @click="changDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data () {
    return {
      // 存储图片的数据
      spuImageList: [],
      // 存储销售属性
      saleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        "category3Id": 0,
        "price": 0,
        // 平台属性
        "skuAttrValueList": [
          {
            "attrId": 0,
            "attrName": "",
            "id": 0,
            "skuId": 0,
            "valueId": 0,
            "valueName": ""
          }
        ],
        "skuDefaultImg": "string",
        "skuDesc": "",
        // 设置图片的数据
        "skuImageList": [
          {
            "id": 0,
            "imgName": "string",
            "imgUrl": "string",
            "isDefault": "string",
            "skuId": 0,
            "spuImgId": 0
          }
        ],
        "skuName": "",
        // 销售属性
        "skuSaleAttrValueList": [
          {
            "id": 0,
            "saleAttrId": 0,
            "saleAttrName": "string",
            "saleAttrValueId": 0,
            "saleAttrValueName": "string",
            "skuId": 0,
            "spuId": 0
          }
        ],
        "spuId": 0,
        "tmId": 0,
        "weight": ""
      },
      // 存放spu名称
      spu: {},
      imgList: []
    }
  },
  methods: {
    // 在父组件上调动这个方法获取数据
    async getData (row, id1, id2, id3) {
      // 收集父组件传来的数据
      this.skuInfo.category3Id = row.category3Id
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId
      this.spu = row
      let spuImageListresult = await this.$API.spu.reqGetSkuImageList(row.id)
      if (spuImageListresult.code == 200) {
        console.log(spuImageListresult)
        let list = spuImageListresult.data
        list.forEach(element => {
          element.isDefault = 0
        });
        this.spuImageList = list
      }
      let saleAttrListresult = await this.$API.spu.reqGetSpuSaleAttrList(row.id)
      if (saleAttrListresult.code == 200) {
        console.log(saleAttrListresult)
        this.saleAttrList = saleAttrListresult.data;
      }
      let attrInfoListresult = await this.$API.spu.reqGetAttrInfoList(id1, id2, id3)
      if (attrInfoListresult) {
        console.log(attrInfoListresult)
        this.attrInfoList = attrInfoListresult.data
      }
    },
    handleSelectionChange (params) {
      // parmas可以获取用户选中图片的信息数据
      console.log(params)
      // 注意这个数据里缺少选中的默认
      this.imgList = params;
    },
    // 改变默认状态的回调
    changDefault (row) {
      // 排他
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮的回调
    cancel () {
      this.$emit('changeScenes', 0)
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的点击回调
    async save () {
      const { attrInfoList, skuInfo, saleAttrList, spuImageList } = this
      // 平台属性数据整理
      let arr = []
      attrInfoList.forEach((item) => {
        if (item.attrIdAndvalueId) {
          const [attrId, valueId] = item.attrIdAndvalueId.split(':')
          let obj = { valueId, attrId }
          arr.push(obj)
        }
      })
      skuInfo.skuAttrValueList = arr
      // 销售属性整理数据
      let saleArr = []
      saleAttrList.forEach((item) => {
        if (item.saleIdAndValueId) {
          const [saleId, salevalueId] = item.saleIdAndValueId.split(":")
          let saleObj = { salevalueId, saleId }
          saleArr.push(saleObj)
        }
      })
      skuInfo.skuSaleAttrValueList = saleArr
      skuInfo.skuImageList = spuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      skuInfo.price = parseInt(skuInfo.price)
      console.log(skuInfo)
      let result = await this.$API.spu.reqAddSku(skuInfo)
      console.log(result)
      if (result.code == 200) {
        this.$message({ message: '保存成功', type: 'success' })
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style>
</style>