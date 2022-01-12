<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId='getCategoryId'></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示表 -->
      <div v-show="showTable">
        <el-button type="primary"
                   icon="el-icon-plus"
                   :disabled='buttonDis'
                   @click="addAttr">添加属性</el-button>
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
              <el-button type="danger"
                         icon='el-icon-delete'></el-button>
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
                   :disabled='!attrInfo.attrName'>添加属性值</el-button>
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
                        placeholder="请输入属性值"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="danger"
                         icon='el-icon-delete'
                         size='mini'></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
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
      showTable: true,
      buttonDis: false,
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
      console.log(id1, id2, id3)
      let result = await this.$API.attr.reqGetAttrInfoList(id1, id2, id3);
      console.log(result)
      if (result.code == 200) {
        this.attrList = result.data
        this.buttonDis = false;
      }
    },
    // 添加属性值回调
    addAttrValue () {
      this.attrInfo.attrValueList.push({
        attrId: undefined,
        valueName: ''
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
    }
  }
}
</script>

<style>
</style>