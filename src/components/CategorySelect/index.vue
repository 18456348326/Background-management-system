<template>
  <div>
    <el-form :inline="true"
             :model="cgFromid"
             class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="cgFromid.cgFromid1"
                   placeholder="请选择"
                   @change='handler1'
                   :disabled='show'>
          <el-option :label="L1.name"
                     :value="L1.id"
                     v-for="(L1,index) in cgFromList.list1"
                     :key="index">{{L1.name}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cgFromid.cgFromid2"
                   placeholder="请选择"
                   @change='handler2'
                   :disabled='show'>
          <el-option :label="L2.name"
                     :value="L2.id"
                     v-for="(L2,index) in cgFromList.list2"
                     :key="index">{{L2.name}}</el-option>

        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cgFromid.cgFromid3"
                   placeholder="请选择"
                   @change='handler3'
                   :disabled='show'>
          <el-option :label="L3.name"
                     :value="L3.id"
                     v-for="(L3,index) in cgFromList.list3"
                     :key="index">{{L3.name}}</el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data () {
    return {
      cgFromList: {
        // 一级分类的列表数据
        list1: [],
        // 二级级分类的列表数据
        list2: [],
        // 三级分类的列表数据
        list3: []
      },
      cgFromid: {
        cgFromid1: '',
        cgFromid2: '',
        cgFromid3: ''
      },

    }
  },
  // 当组件一挂载完毕就拿到一级分类数据并渲染
  props: ['show'],
  mounted () {
    this.getCategory1List()
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List () {
      let result = await this.$API.attr.reqCategoryList1()
      if (result.code == 200) {
        this.cgFromList.list1 = result.data
      }
    },
    // 当一级分类选择发生改变时获取二级分类的数据
    async handler1 () {
      this.cgFromList.list2 = []
      this.cgFromList.list3 = []
      this.cgFromid.cgFromid2 = ''
      this.cgFromid.cgFromid3 = ''
      this.$emit('getCategoryId', { id: this.cgFromid.cgFromid1, level: 1 })
      let result = await this.$API.attr.reqCategoryList2(this.cgFromid.cgFromid1)
      // console.log(result)
      if (result.code == 200) {
        this.cgFromList.list2 = result.data
      }
    },
    // 当二级分类选择发生改变时获取三级分类的数据
    async handler2 () {
      this.cgFromList.list3 = []
      this.cgFromid.cgFromid3 = ''
      this.$emit('getCategoryId', { id: this.cgFromid.cgFromid2, level: 2 })
      let result = await this.$API.attr.reqCategoryList3(this.cgFromid.cgFromid2)
      // console.log(result)
      if (result.code == 200) {
        this.cgFromList.list3 = result.data
      }
    },
    // 三级分类选择发生改变时发送查询数据请求
    handler3 () {
      // 
      this.$emit('getCategoryId', { id: this.cgFromid.cgFromid3, level: 3 })
    }
  }
}
</script>

<style>
</style>