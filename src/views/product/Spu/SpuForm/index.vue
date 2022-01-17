<template>
  <div>
    <el-form label-width='80px'
             :model='spu'>
      <el-form-item label="spu的名称">
        <el-input placeholder="spu名称"
                  v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌"
                   v-model="spu.tmId">
          <el-option value="value"
                     v-for="(item,index) in trademarkList"
                     :key="item.id"
                     :label='item.tmName'
                     :value='item.id'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌描述">
        <el-input type="textarea"
                  rows='4'
                  placeholder="spu描述"
                  v-model="spu.description">
        </el-input>
      </el-form-item>
      <el-form-item label="spu图片">
        <!-- 上传组件 action是图片上传的地址 
        file-list是照片墙需要展示的数据【数组，数组中的元素必须要有name，url属性】
        on-preview是预览的回调
        -->
        <el-upload action="/dev-api/admin/product/fileUpload"
                   list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :file-list='imageList'
                   :on-success='updateImage'>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdandName"
                   :placeholder="`还有${unselectSaleAttr.length}未选择`">
          <el-option v-for="(item,index) in unselectSaleAttr"
                     :key="item.id"
                     :value='`${item.id},${item.name}`'
                     :label='item.name'></el-option>
        </el-select>
        <el-button type="primary"
                   icon='el-icon-plus'
                   :disabled='!attrIdandName'
                   @click="addSaleAttr">添加销售属性</el-button>
        <el-table border
                  :data='spu.spuSaleAttrList'>
          <el-table-column label="序号"
                           type='index'
                           align='center'
                           width='80px'></el-table-column>
          <el-table-column label="属性名"
                           prop='saleAttrName'> </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{row,$index}">
              <!-- el-tag用来展示已有属性值列表数据的 -->
              <el-tag :key="tag.id"
                      v-for="(tag,index) in row.spuSaleAttrValueList"
                      closable
                      :disable-transitions="false"
                      @close="row.spuSaleAttrValueList.splice(index,1)">
                {{tag.saleAttrValueName}}
              </el-tag>
              <el-input class="input-new-tag"
                        v-if="row.inputVisible"
                        v-model="row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(row)"
                        @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else
                         class="button-new-tag"
                         size="small"
                         @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title='`确定删除${row.saleAttrName}吗`'
                             @onConfirm='deleteSaleAttr($index)'>
                <el-button type="danger"
                           icon='el-icon-delete'
                           size='mini'
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary"
                   @click="updateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data () {
    return {
      // 收集选择的销售属性的id
      attrIdandName: '',
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        // 三级分类的id
        "category3Id": 0,
        // spu的描述
        "description": "",
        // 收集spu图片的信息
        "spuImageList": [
        ],
        // spu名称
        "spuName": "",
        // 平台属性和属性值收集
        "spuSaleAttrList": [
          // {
          //   "baseSaleAttrId": 0,
          //   "id": 0,
          //   "saleAttrName": "string",
          //   "spuId": 0,
          //   "spuSaleAttrValueList": [
          //     {
          //       "baseSaleAttrId": 0,
          //       "id": 0,
          //       "isChecked": "string",
          //       "saleAttrName": "string",
          //       "saleAttrValueName": "string",
          //       "spuId": 0
          //     }
          //   ]
          // }
        ],
        // 品牌的id
        "tmId": ''
      },
      // 存储品牌信息列表
      trademarkList: [],
      // 存储图片信息列表
      imageList: [],
      // 存储平台销售属性
      baseSaleAttr: [],
    }
  },
  computed: {
    unselectSaleAttr () {
      return this.baseSaleAttr.filter(item => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        })
      })

    }
  },
  methods: {
    // 图片墙删除按钮的回调
    handleRemove (file, fileList) {
      // file 代表的是删除的那个图片
      // fileList代表删除后剩下的其他图片
      console.log(file, fileList);
      this.imageList = fileList
    },
    // 图片墙预览的回调
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片墙图片上传成功的回调
    updateImage (respose, filt, fileList) {
      console.log(respose, filt, fileList)
      this.imageList = fileList
    },
    async initSpuForm (spu) {
      // console.log(spu)
      // 获取spu信息的数据
      let spuResult = await this.$API.spu.reqGetSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      // console.log(trademarkResult)
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取图片信息
      let spuImageResult = await this.$API.spu.reqGetSpuImageList(spu.id);
      // console.log(spuImageResult)
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data
        listArr.forEach(element => {
          element.name = element.imgName
          element.url = element.imgUrl
        });
        this.imageList = listArr
      }
      // 获取平台销售属性
      let baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(baseSaleAttrResult)
      if (baseSaleAttrResult.code == 200) {
        this.baseSaleAttr = baseSaleAttrResult.data
      }
    },
    // 失去焦点和enter键触发的回调
    handleInputConfirm (row) {
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() == '') {
        this.$message({ type: 'warning', message: '不能为空' })
        return
      }
      // console.log(inputValue)
      // console.log(row.spuSaleAttrValueList[0].saleAttrValueName)
      // every在检测到第一个结果为false的数据时，就会停止运行，所以这里要用不等于。
      let result = row.spuSaleAttrValueList.every(item => item.saleAttrValueName != inputValue)
      // console.log(result)
      if (result) {
        row.spuSaleAttrValueList.push({ baseSaleAttrId, saleAttrValueName: inputValue })
        row.inputVisible = false;
      } else {
        this.$message({ type: 'warning', message: '不能重复' })
      }
    },
    // 点击添加按钮的回调
    addSaleAttrValue (row) {
      // 添加的这个属性是控制input和button的切换
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // 删除平台属性的回调
    deleteSaleAttr (index) {
      this.spu.spuSaleAttrList.splice(index, 1)
    },
    addSaleAttr () {
      const [baseSaleAttrId, saleAttrName] = this.attrIdandName.split(',')
      // console.log([baseSaleAttrId, saleAttrName])
      let newSaleAtrr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAtrr)
      this.attrIdandName = ''
    },
    async updateSpu () {
      this.spu.spuImageList = this.imageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      let result = await this.$API.spu.reqUpdateSpu(this.spu)
      if (result.code == 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
        Object.assign(this._data, this.$options.data())
      }
    },
    // 点击添加spu发送的请求
    async addSpuForm (id3) {

      this.spu.category3Id = id3
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      // console.log(trademarkResult)
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      // 获取平台销售属性
      let baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(baseSaleAttrResult)
      if (baseSaleAttrResult.code == 200) {
        this.baseSaleAttr = baseSaleAttrResult.data
      }
    },
    // 取消的回调
    cancel () {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // Objecj.assign:es6中新增的方法可以合并对象
      // 组件实例this._data：可以操作data中的响应式数据
      // this.$options可以获取配置对象,配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    }
  }
}

</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>