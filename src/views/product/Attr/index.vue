<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId='getCategoryId'
                      :show='!showTable'></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示表 -->
      <div v-show="showTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled='buttonDis1'
                   @click="addAttr"
                   style="margin:20px 0px ">添加属性</el-button>
        <el-table border
                  style="width: 100%"
                  :data='attrList'>
          <el-table-column type='index'
                           label="序号"
                           width="80"
                           align='center'>
          </el-table-column>
          <el-table-column prop="attrName"
                           label="属性名称"
                           width="150">
          </el-table-column>
          <el-table-column prop="address"
                           label="属性值列表">
            <template slot-scope="{row,$index}">
              <el-tag type="success"
                      v-for="(item,index) in row.attrValueList"
                      :key="index"
                      style="margin:0px 20px">{{item.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address"
                           label="操作"
                           width="150">
            <template slot-scope="{row,$index}">
              <el-button type="warning"
                         icon='el-icon-edit'
                         @click="updateAttr(row)"></el-button>
              <el-popconfirm :title='`确定删除${row.attrName}吗？`'
                             @onConfirm='deleteAttr(row.id)'>
                <el-button type="danger"
                           icon='el-icon-delete'
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改界面 -->
      <div v-show="!showTable">
        <el-form :inline='true'
                 :model='attrInfo'>
          <el-form-item label="属性名"
                        label-width='80px'>
            <el-input placeholder="请输入属性名"
                      v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary"
                   icon='el-icon-puls'
                   @click="addAttrValue"
                   :disabled='!(attrInfo.attrName && !buttonDis2)'>添加属性值</el-button>
        <el-button @click="showTable=true">取消</el-button>
        <el-table border
                  style="margin:20px 0px"
                  :data='attrInfo.attrValueList'>
          <el-table-column label="序号"
                           type='index'
                           align='center'
                           width='80px'></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName"
                        size='mini'
                        placeholder="请输入属性值"
                        @blur='tolook(row,$index)'
                        :ref="$index"
                        @keyup.native.enter="tolook(row,$index)"
                        v-show="row.flag"></el-input>
              <span v-show="!row.flag"
                    @click="toEdit(row,$index)"
                    style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <!-- 气泡确认框 -->
            <template slot-scope="{row,$index}">
              <el-popconfirm :title='`确定删除${row.valueName}吗？`'
                             @onConfirm='deleteAttrValue($index)'>
                <el-button type="danger"
                           slot="reference"
                           icon='el-icon-delete'
                           size='mini'></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary"
                   @click="saveAttr"
                   :disabled='!(attrInfo.attrValueList.length && !buttonDis2)'>保存</el-button>
        <el-button @click="showTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入loadsh当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Attr',
  data () {
    return {
      // 控制修改界面的输入框和span框进行切换
      showInput: true,
      //控制展示表格和修改界面进行切换
      showTable: true,
      // 控制添加属性按钮的可用
      buttonDis1: true,
      // 控制添加属性名按钮的可用
      buttonDis2: false,
      cgId: {
        id1: '',
        id2: '',
        id3: ''
      },
      // 放置请求的属性列表
      attrList: [],
      // 放置发送给服务器的属性列表
      attrInfo: {
        "attrName": "", // 属性名
        "attrValueList": [  //属性值列表,每个属性值都是一个对象

        ],
        "categoryId": 0, //三级分类的id值
        "categoryLevel": 3, //服务器需要的id等级 默认为三级
      }
    }
  },
  methods: {
    // 把该自定义事件交给子组件进行调用传参
    getCategoryId ({ id, level }) {
      if (level == 1) {
        this.cgId.id1 = id
        this.cgId.id2 = ''
        this.cgId.id3 = ''
      } else if (level == 2) {
        this.cgId.id2 = id
        this.cgId.id3 = ''
      } else if (level == 3) {
        this.cgId.id3 = id
        // 当第三id就位就可以发送请求拿下方列表的数据了
        this.getAttrList()
      }

    },
    // 当用户选定三级分类时向服务器发送请求展示属性列表
    async getAttrList () {
      const { id1, id2, id3 } = this.cgId
      // console.log(id1, id2, id3)
      let result = await this.$API.attr.reqGetAttrInfoList(id1, id2, id3);
      // console.log(result)
      if (result.code == 200) {
        this.attrList = result.data
        this.buttonDis1 = false;
      }
    },
    // 添加属性值回调
    addAttrValue () {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        flag: true
      })
      this.buttonDis2 = true;
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      })
    },
    // 添加属性按钮的回调
    addAttr () {
      this.showTable = false
      this.attrInfo = {
        "attrName": "", // 属性名
        "attrValueList": [  //属性值列表,每个属性值都是一个对象

        ],
        "categoryId": this.cgId.id3, //三级分类的id值
        "categoryLevel": 3, //服务器需要的id等级 默认为三级
      }
    },
    updateAttr (row) {
      this.showTable = false
      // 由于数据中存在对象套数组，数组套对象的情况，浅拷贝不足以应对这种情况，需要使用深拷贝
      // 深拷贝浅拷贝面试考的很多
      this.attrInfo = cloneDeep(row)
      // 在修改某一属性是在每个属性值中添加flag
      this.attrInfo.attrValueList.forEach(item => {
        // 这样书写虽然可以添加flag，但这样做视图不会随着flag变化发生改变,因为这个flag不是响应式数据
        // item.flag = false
        // 使用set方法可以添加响应式数据
        // 第一个参数是添加到哪个对象当中，第二个参数是属性名，第三个参数是属性值
        this.$set(item, 'flag', false)
      });
    },
    // 输入框的回调，来变成查看模式
    tolook (row, index) {
      // row是当前用户添加的属性值
      if (row.valueName.trim() == '') {
        this.$message({
          message: '不应为空',
          type: 'warning'
        })
        this.$refs[index].focus();
        return;
      }
      let isRepat = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      })
      // console.log(isRepat)
      if (isRepat) {
        this.$message({
          message: '不应为重复属性名',
          type: 'warning'
        })
        this.$refs[index].focus();
        return
      }
      this.buttonDis2 = false;
      row.flag = false;
    },
    // 文本span的回调，来变成编辑模式
    toEdit (row, index) {
      row.flag = true
      //需要注意，点击span的时候，切换为input变为编辑博士，但是需要注意对于浏览器而言，页面重绘与重排耗时间的
      //点击span的时候，重绘重排一个input他是需要耗费时间，因此我们不可能一点击span立马获取到input
      // $nextTick，当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus();
      })
    },
    // 气泡框确认后删除属性名的回调
    deleteAttrValue (index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    async saveAttr () {
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        delete item.flag;
        return true
      })
      try {
        await this.$API.attr.reqAddAttr(this.attrInfo)
        this.$message({ message: '保存成功', type: 'success' })
        this.getAttrList()
        this.showTable = true
      } catch (error) {
        this.$message({ message: '保存失败', type: 'danger' })
      }
    },
    async deleteAttr (id) {
      console.log(id)
      let result = await this.$API.attr.reqDeleteAttr(id)
      if (result.code == 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.getAttrList()
      }

    }
  }
}
</script>

<style>
</style>