<template>
  <div class="user-info-setting">
    <el-space direction="vertical">
      <el-text>
        <strong>昵称：</strong>{{ userInfo.nick }}
        <el-link @click="this.dialogChangeNickVisible = true">修改</el-link>
      </el-text>
      <el-text><strong>邮箱：</strong>{{ userInfo.email }}</el-text>
      <el-text><strong>ID：</strong>{{ userInfo.id }}</el-text>
      <el-text type="primary"
        ><strong>个性签名：</strong>{{ userInfo.desc }}
        <el-link @click="this.dialogChangeDescVisible = true">修改</el-link></el-text
      >
    </el-space>
    <el-dialog title="修改昵称" v-model="dialogChangeNickVisible" :width="500">
      <el-form label-width="100px">
        <el-form-item label="新ID">
          <el-input v-model="newNick"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogChangeNickVisible = false">取消</el-button>
        <el-button type="primary" @click="updateId">确认</el-button>
      </template>
    </el-dialog>
    <!-- 添加对话框部分 -->
    <el-dialog title="修改个性签名" v-model="dialogChangeDescVisible" :width="500">
      <el-form label-width="100px">
        <el-form-item label="新个性签名">
          <el-input v-model="newDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogChangeDescVisible = false">取消</el-button>
        <el-button type="primary" @click="updateDesc">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getCookieValue } from '@/utils/cookieutils'

export default {
  name: 'UserInfoSetting',
  data() {
    return {
      newNick: '',
      newDesc: '',
      dialogChangeNickVisible: false,
      dialogChangeDescVisible: false
    }
  },
  props: {
    userInfo: Object
  },
  mounted() {
    console.log(this.userInfo)
  },
  methods: {
    async updateId() {
      // 检查ID是否为空或全为空格
      if (!this.newNick || !this.newNick.trim()) {
        this.$message.error('昵称不能为空')
        return // 结束方法，不执行后续的请求
      }
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/user/change/nick',
          {
            fp: getCookieValue('fp'),
            id: this.userInfo.id,
            new_nick: this.newNick
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )

        // 处理成功响应
        if (response.data.code === 200) {
          this.$message.success(response.data.message)
          location.reload()
        } else {
          this.$message.error(response.data.message)
        }
      } catch (error) {
        // 处理请求失败的情况
        this.$message.error('修改失败')
      }
    },
    async updateDesc() {
            // 检查个签是否为空或全为空格
            if (!this.newDesc || !this.newDesc.trim()) {
        this.$message.error('个签不能为空')
        return // 结束方法，不执行后续的请求
      }
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/user/change/desc',
          {
            fp: getCookieValue('fp'),
            id: this.userInfo.id,
            new_desc: this.newDesc
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )

        // 处理成功响应
        if (response.data.code === 200) {
          this.$message.success(response.data.message)
          location.reload()
        } else {
          this.$message.error(response.data.message)
        }
      } catch (error) {
        // 处理请求失败的情况
        this.$message.error('修改失败')
      }
    }
  }
}
</script>

<style scoped>
.user-info-setting {
  display: flex;
  margin: auto auto;
}

.user-details {
  margin: auto auto;
}
</style>
