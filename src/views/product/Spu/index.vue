<template>
  <div>
    <el-card>
      <!-- 这个是全局组件可以直接使用 -->
      <CategorySelect @getCategoryId='getCategoryId'
                      :show='scene!=0'></CategorySelect>
    </el-card>
    <el-card style="margin:20px 0px">
      <!-- 这里会有三个部分进行切换 -->
      <div v-show="scene==0">
        <!-- 这个是spu列表展示部分 -->
        <el-button type="primary"
                   icon='el-icon-plus'
                   @click="addSpu"
                   :disabled='!cgId.id3'>添加spu</el-button>
        <el-table border
                  :data='spuList'>
          <el-table-column label="序号"
                           width='80px'
                           align='center'
                           type='index'></el-table-column>
          <el-table-column label="spu名称"
                           prop='spuName'></el-table-column>
          <el-table-column label="spu描述"
                           prop='description'></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="success"
                         icon='el-icon-plus'
                         size='mini'
                         title="添加sku"
                         @click="addSku(row)"></el-button>
              <el-button type="warning"
                         icon='el-icon-edit'
                         size='mini'
                         title="修改spu"
                         @click="updateSpu(row)"></el-button>
              <el-button type="info"
                         icon='el-icon-info'
                         size='mini'
                         title="查看当前spu上的全部sku"
                         @click="handler(row)"></el-button>
              <el-popconfirm :title='`确定删除${row.spuName}?`'
                             @onConfirm='deleteSpu(row)'
                             style="margin:10px">
                <el-button type="danger"
                           icon='el-icon-delete'
                           size='mini'
                           title="删除"
                           slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center"
                       :total="pagination.total"
                       :current-page="pagination.page"
                       :page-size="pagination.limit"
                       :page-sizes='[3,5,10]'
                       layout=" prev, pager, next,jumper, ->,sizes,total"
                       @size-change='sizeChange'
                       @current-change='currentChange'></el-pagination>
      </div>
      <SpuForm v-show="scene==1"
               @changeScene='changeScene'
               ref="spuForm"></SpuForm>
      <SkuForm v-show="scene==2"
               ref="skuForm"
               @changeScenes='changeScenes'></SkuForm>

    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`"
               :visible.sync="dialogTableVisible"
               :before-close='close'>
      <el-table :data="skuList"
                v-loading="loading">
        <el-table-column property="skuName"
                         label="名称"
                         width="150"></el-table-column>
        <el-table-column property="price"
                         label="价格"
                         width="200"></el-table-column>
        <el-table-column property="weight"
                         label="重量"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg"
                 style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>

</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  data () {
    return {
      // 分页器数据存放处
      pagination: {
        total: 0,
        page: 1,
        limit: 3
      },
      // 三级联动的id存放处
      cgId: {
        id1: '',
        id2: "",
        id3: ""
      },

      // 存放spu列表数据
      spuList: [],
      // 控制下方操作页面切换
      scene: 0, //0代表切换spu列表展示，1代表切换spu添加修改界面 ，2代表切换添加sku修改界面
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true
    }
  },
  components: {
    SpuForm,
    SkuForm
  },
  methods: {
    // 三级联动的自定义事件，可以把三级id传到这里
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
        this.getSpuList()
      }
    },
    //获取spu列表的方法
    async getSpuList () {
      let result = await this.$API.spu.reqSpuList(this.pagination.page, this.pagination.limit, this.cgId.id3)
      if (result.code == 200) {
        this.pagination.total = result.data.total;
        this.spuList = result.data.records
      }
    },
    // 改变分页器每页规模的回调
    sizeChange (limit) {

      this.pagination.limit = limit
      this.getSpuList()
    },
    //改变当前页数的回调
    currentChange (page) {
      this.pagination.page = page
      this.getSpuList()
    },
    // 点击添加按钮弹出spuform
    addSpu () {
      this.scene = 1
      this.$refs.spuForm.addSpuForm(this.cgId.id3)
    },
    // 点击修改按钮弹出spuform
    updateSpu (row) {
      this.scene = 1
      // console.log(this.$refs.spuForm)
      this.$refs.spuForm.initSpuForm(row)
    },
    // spuform自定义事件，用于切换场景
    changeScene ({ scene, flag }) {
      this.scene = scene;
      // 子组件切换完要刷新页面
      if (flag == '修改') {
        this.getSpuList()
      } else if (flag == '添加') {
        this.pagination.page = 1
        this.getSpuList()
      }

    },
    async deleteSpu (row) {
      // reqDeleteSpu
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        if (this.spuList.length > 1) {
          this.getSpuList()
        } else {
          this.pagination.page = this.pagination.page - 1
          this.getSpuList()
        }


      }
    },
    // 点击添加sku按钮的回调
    addSku (row) {
      this.scene = 2
      this.$refs.skuForm.getData(row, this.cgId.id1, this.cgId.id2, this.cgId.id3)
    },
    // skuForm的切换场景方法
    changeScenes (scene) {
      this.scene = scene
    },
    async handler (row) {

      this.dialogTableVisible = true
      this.spu = row
      // 获取sku列表数据
      let result = await this.$API.spu.reqSkuList(this.spu.id)
      // console.log(result)
      if (result.code == 200) {
        this.loading = false
        this.skuList = result.data
      }
    }, close (done) {
      done()
      this.loading = true
      this.skuList = []

    }
  }
}
</script>

<style>
</style>
