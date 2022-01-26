<template>
  <div>
    <el-table border
              :data='records'>
      <el-table-column type='index'
                       width='80'
                       align='center'
                       label="序号"></el-table-column>
      <el-table-column label="名称"
                       prop='skuName'></el-table-column>
      <el-table-column label="描述"
                       prop='skuDesc'></el-table-column>
      <el-table-column label="默认图片"
                       width='110'>
        <template slot-scope="{row,$index}">
          <img :src="row.skuDefaultImg"
               style="width:100px;height:100px">
        </template>
      </el-table-column>
      <el-table-column label="重量"
                       width='80'
                       prop='weight'></el-table-column>
      <el-table-column label="价格"
                       width='80'
                       prop='price'></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button type="success"
                     size='mini'
                     icon='el-icon-download'
                     v-if="row.isSale==0"
                     @click="onSale(row)"></el-button>
          <el-button type="info"
                     size='mini'
                     icon='el-icon-upload2'
                     v-else
                     @click="cancelSale(row)"></el-button>
          <el-button type="primary"
                     size='mini'
                     icon='el-icon-edit'
                     @click="$message({message:'正在开发中',type:'info'})"></el-button>
          <el-button type="info"
                     size='mini'
                     icon='el-icon-info'
                     @click="getSkuInfo(row)"></el-button>
          <el-button type="danger"
                     size='mini'
                     icon='el-icon-delete'></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :total="total"
                   :current-page="page"
                   :page-size="limit"
                   :page-sizes='[3,5,10]'
                   layout="prev,pager,next,jumper,->,sizes,total"
                   style="text-align:center"
                   @current-change='getSkuList'
                   @size-change='sizeChange'></el-pagination>
    <el-drawer :visible.sync="drawer"
               :show-close='false'
               size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success"
                    v-for="(item,index) in skuInfo.skuAttrValueList"
                    :key="item.id">{{item.attrName}}</el-tag>
          </template>

        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="400px">
            <el-carousel-item v-for="item in skuInfo.skuImageList"
                              :key="item.id">
              <img :src="item.imgUrl"
                   height="400px"
                   width="400px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'Sku',
  data () {
    return {
      total: 20,
      page: 1,
      limit: 5,
      records: [],
      skuInfo: {},
      drawer: false
    }
  },
  mounted () {
    this.getSkuList()
  }
  ,
  methods: {
    // 获取skulist数据的方法
    async getSkuList (page = 1) {
      this.page = page
      let result = await this.$API.sku.reqGetSkuList(this.page, this.limit)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    sizeChange (limit) {
      this.limit = limit
      this.getSkuList()
    },
    async onSale (row) {
      let result = await this.$API.sku.reqOnSale(row.id)
      if (result.code == 200) {
        this.$message({ message: '上架成功', type: 'success' })
        this.getSkuList()
      }
    },
    async cancelSale (row) {
      let result = await this.$API.sku.reqCancelSale(row.id)
      if (result.code == 200) {
        this.$message({ message: '下架成功', type: 'success' })
        this.getSkuList()
      }
    },
    async getSkuInfo (sku) {
      let result = await this.$API.sku.reqGetSkuById(sku.id)
      if (result.code == 200) {
        this.skuInfo = result.data
        this.drawer = true
      }
    }
  }
}
</script>

<style>
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
<style scoped>
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
}
</style>