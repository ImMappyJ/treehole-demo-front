<template>
  <el-card class="comment-item">
    <template #header>
      <div class="clearfix">
        <span class="author-info">
          <el-avatar :size="20">
            <el-icon> <Avatar /> </el-icon
          ></el-avatar>
          {{ comment.author.nick }}
        </span>
        <span class="post-time">{{ formattedPostTime }}</span>
      </div>
    </template>
    <div class="comment-content">{{ comment.comment }}</div>
    <template #footer>
      <div class="footer-links">
        <el-link class="footer-link" v-if="isChildren">回复</el-link>
        <el-link
          class="footer-link"
          v-if="userInfo.id == comment.author.id || userInfo.group == 1"
          @click="deleteComment"
          >删除</el-link
        >
      </div>
      <el-collapse v-if="!isChildren">
        <el-collapse-item :title="'回复(' + totalComments + ')'" name="nested-comments">
          <!-- 子评论内容 -->
          <div v-if="childrenComments.length > 0" class="nested-comments">
            <comment-item
              :is-children="true"
              v-for="(childComment, index) in childrenComments"
              :key="index"
              :comment="childComment"
              :current-login-user-id="userInfo.id"
            />
          </div>
          <div v-else class="no-nested-comments">暂无回复</div>

          <!-- 分页器 -->
          <el-pagination
            v-if="totalPageCount > 1"
            :current-page="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="totalComments"
            @current-change="handleCurrentChange"
          />

          <!-- 回复表单 -->
          <div class="reply-form">
            <el-input
              v-model="replyContent"
              placeholder="请输入回复内容"
              @keyup.enter="postReply"
            ></el-input>
            <el-button type="primary" @click="postReply">回复</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </template>
  </el-card>
</template>

<script>
import axios from 'axios'
import { getCookieValue } from '@/utils/cookieutils'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'CommentItem',
  props: {
    comment: Object,
    isChildren: {
      type: Boolean,
      default: false
    },
    articleId: Number,
    userInfo: Object
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      childrenComments: [], // 子评论数据
      totalComments: 0, // 总评论数
      totalPageCount: 0, // 总页数
      replyContent: ''
    }
  },
  mounted() {
    if (!this.isChildren) this.getChildrenComments()
  },
  methods: {
    async deleteComment() {
      const commentId = this.comment.comment_id
      const fp = getCookieValue('fp')

      const confirmDelete = await ElMessageBox.confirm('确定要删除这条评论吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!confirmDelete) {
        ElMessage.info('取消删除评论')
        return
      }

      const url = 'http://127.0.0.1:5000/user/delete/comment'
      const data = new URLSearchParams()
      data.append('id', commentId)
      data.append('fp', fp)

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data
        })

        const responseData = await response.json()

        if (responseData.code === 200) {
          ElMessage.info('评论删除成功')
        } else {
          ElMessage.error('评论删除失败: ' + responseData.message)
        }
      } catch (error) {
        ElMessage.error('发生错误: ' + error.message)
      }
    },
    async getChildrenComments() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/comment/get/by/id', {
          params: {
            id: this.comment.comment_id,
            page: this.currentPage,
            per_page: this.pageSize
          }
        })

        this.childrenComments = response.data.data.comments
        this.totalComments = response.data.data.total
        this.totalPageCount = response.data.data.pages
      } catch (error) {
        console.error('Error fetching children comments:', error)
      }
    },
    async postReply() {
      if (!this.replyContent || !this.replyContent.trim()) {
        this.$message.error('回复内容不能为空')
        return
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/comment/post',
          {
            father_comment: this.comment.comment_id,
            fp: getCookieValue('fp'),
            comment: this.replyContent.trim(),
            article: this.articleId
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        if (response.data.code === 200) {
          this.replyContent = '' // 清空回复内容
          this.$message.success(response.data.message)
          this.getChildrenComments() // 更新评论列表
        } else {
          this.$message.error(response.data.message)
        }
      } catch (error) {
        console.error('Error posting reply:', error)
        this.$message.error('回复发送失败')
      }
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.getChildrenComments()
    }
  },
  computed: {
    formattedPostTime() {
      const postTime = new Date(this.comment.post_time)
      const year = postTime.getUTCFullYear()
      const month = ('0' + (postTime.getUTCMonth() + 1)).slice(-2)
      const day = ('0' + postTime.getUTCDate()).slice(-2)
      const hours = ('0' + postTime.getUTCHours()).slice(-2)
      const minutes = ('0' + postTime.getUTCMinutes()).slice(-2)
      const seconds = ('0' + postTime.getUTCSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
.reply-form {
  display: flex;
}
.author-info {
  display: flex;
  align-items: center;
  margin: 10px 0px;
}

.post-time {
  margin-left: 10px;
  color: #999;
}

.comment-content {
  margin-top: 10px;
}

.nested-comments {
  margin-top: 10px;
}

.no-nested-comments {
  color: #999;
  text-align: center;
  margin-top: 10px;
}

.author-info {
  font-weight: bold;
}

.post-time {
  margin-left: 10px;
  color: #999;
}

.comment-content {
  margin-top: 10px;
}

.nested-comments {
  margin-top: 10px;
}

.no-nested-comments {
  color: #999;
  text-align: center;
  margin-top: 10px;
}

.footer-links {
  display: flex;
  margin-bottom: 10px;
}

.footer-link {
  margin-right: 50px;
}
</style>
