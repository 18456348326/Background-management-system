<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId='getCategoryId'></CategorySelect>
    </el-card>
    <el-card></el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data () {
    return {
      cgId: {
        id1: '',
        id2: '',
        id3: ''
      }
    }
  },
  methods: {
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

      }

    }
  }
}
</script>

<style>
</style>