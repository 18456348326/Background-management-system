<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type='primary'
               icon="el-icon-plus"
               style="margin:10px 0px"
               @click="showDialogForm">添加
    </el-button>
    <!-- 主体表格 -->
    <el-table border
              :data='list'>
      <el-table-column label="序号"
                       type='index'
                       width="80px"
                       align='center'>

      </el-table-column>
      <el-table-column label="品牌名称"
                       prop='tmName'
                       width="width">

      </el-table-column>
      <el-table-column label="品牌logo"
                       prop='prop'
                       width="width">
        <!-- row就是当前品牌的信息 -->
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl"
               class="logoImg">
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       prop='prop'
                       width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning"
                     icon="el-icon-edit"
                     @click="updateDialogForm(row)">修改</el-button>
          <el-button type="danger"
                     icon="el-icon-delete"
                     @click="deleteDialogForm(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--   分页器  -->
    <el-pagination style="margin-top:20px; text-align: center;"
                   @size-change='sizeChange'
                   @current-change='getPageList'
                   :current-page="page"
                   :total="total"
                   :page-size="limit"
                   :page-sizes="[3,5,10]"
                   :pager-count='7'
                   layout="prev, pager, next ,jumper,->,sizes,total">

    </el-pagination>

    <!-- 弹出对话框 -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'"
               :visible.sync="dialogFormVisible">
      <el-form style="width:80%"
               :model='tmForm'
               :rules='rules'
               ref="tmForm">
        <el-form-item label="品牌名称"
                      :label-width="formLabelWidth"
                      prop='tmName'>
          <el-input autocomplete="off"
                    v-model='tmForm.tmName'></el-input>
        </el-form-item>
        <el-form-item label='品牌图标'
                      :label-width="formLabelWidth"
                      prop='logoUrl'>
          <!-- action设置的是图片上传地址 -->
          <el-upload class="avatar-uploader"
                     action="/dev-api/admin/product/fileUpload"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl"
                 :src="tmForm.logoUrl"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip"
                 class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="changeTradeMarkList">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'TradeMark',
  data () {
    return {
      //当前页数
      page: 1,
      //每页显示几条数据
      limit: 3,
      //数据的条数
      total: 0,
      //列表数据
      list: [],
      //控制弹出框显示或隐藏
      dialogFormVisible: false,
      // 控制表单的宽度
      formLabelWidth: '120px',

      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片', trigger: 'change' }
        ],
      }


    }
  },
  mounted () {
    // console.log(this.$API)
    // this.$message({ message: 'yes', type: 'success' })
    this.getPageList(this.page);
  },
  methods: {
    // 获取品牌列表
    async getPageList (newPage = 1) {
      this.page = newPage
      const { page, limit } = this;
      let data = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      // console.log(data)
      if (data.code == 200) {
        this.total = data.data.total;
        this.list = data.data.records;
      }
    },
    // 更改一页显示列表数
    sizeChange (newLimit) {
      this.limit = newLimit;
      this.getPageList()
    },
    // 设置图片上传成功后的操作
    handleAvatarSuccess (res, file) {
      this.tmForm.logoUrl = res.data;
    },
    //图片上传前的操作
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 向列表中添加品牌信息
    showDialogForm () {
      this.dialogFormVisible = true
      this.tmForm = {
        tmName: '',
        logoUrl: ''
      }
    },
    // 修改品牌信息
    updateDialogForm (row) {
      this.dialogFormVisible = true
      // 将已有的信息赋值给tmForm展示
      this.tmForm = { ...row };
    },
    // 提交相应的品牌信息
    changeTradeMarkList () {
      this.$refs.tmForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false
          let result = await this.$API.tradeMark.reqChangeTradeMarkList(this.tmForm)
          console.log(result)
          if (result.code == 200) {
            this.$message({
              message: this.tmForm.id ? '品牌修改成功' : '品牌上传成功',
              type: 'success',
            })
          }
          this.getPageList(this.tmForm.id ? this.page : 1)
        } else {
          return
        }
      })
    },
    deleteDialogForm (row) {
      this.$confirm(`此操作将永久删除${row.tmName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$API.tradeMark.reqDeleteTradeMarkList(row.id)
        console.log(result)
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}

</script>

<style>
.logoImg {
  width: 100px;
  height: 100px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
