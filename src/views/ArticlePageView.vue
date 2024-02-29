<template>
  <div class="article-detail" v-if="dataLoaded">
    <el-card>
      <template #header>
        <div class="article-header">
          <div class="left-section">
            <div class="article-title">{{ article.title }}</div>
            <div class="author-info">
              <el-avatar @click="goToAuthorProfile(author.id)" :size="30">
                <el-icon :size="20"> <Avatar /> </el-icon
              ></el-avatar>
              <span @click="goToAuthorProfile(author.id)">{{ author.nick }}</span>
            </div>
          </div>
          <div class="right-section">
            <div class="article-extra">
              <el-tag type="primary">#{{ article.id }}</el-tag>
            </div>
            <!-- 显示文章ID -->
            <div class="article-category">
              <el-tag type="info" effect="light"
                ><el-icon> <Discount /> </el-icon>{{ article.type }}</el-tag
              >
            </div>
            <div class="article-info">
              <el-tag type="info"
                ><el-icon><Clock /></el-icon>{{ formattedPostTime }}</el-tag
              >
            </div>
          </div>
        </div>
      </template>
      <div class="article-content" v-html="article.context"></div>
      <template #footer>
        <div class="footer-buttons">
          <el-button type="primary" @click="likeArticle">点赞 {{ article.like }}</el-button>
          <el-button
            type="danger"
            v-if="userInfo.id == author.id || userInfo.group == 1"
            @click="deleteArticle"
            >删除</el-button
          >
        </div>
      </template>
    </el-card>
    <el-card class="comments">
      <div>
        <h2>评论({{ article.comment }})</h2>
      </div>
      <div class="comment-input">
        <el-input
          v-model="newComment"
          placeholder="请输入评论内容"
          @keyup.enter="postComment"
          class="comment-input"
        ></el-input>
        <el-button type="primary" @click="postComment" class="comment-button">发布评论</el-button>
      </div>
      <CommentItem
        v-for="comment in comments"
        :key="comment.comment_id"
        :comment="comment"
        :articleId="article.id"
        :user-info="userInfo"
      >
      </CommentItem>
      <el-pagination
        :hide-on-single-page="true"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="handleCommentsPageChange"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { reactive } from 'vue'
import { getCookieValue } from '@/utils/cookieutils'
import CommentItem from '@/components/CommentItem.vue'
import { ElMessageBox, ElMessage } from 'element-plus'

export default {
  name: 'ArticlePageView',
  components: {
    CommentItem
  },
  props: {
    id: {
      type: String,
      required: true
    },
    userInfo: Object
  },
  data() {
    return {
      article: {},
      author: {},
      comments: [],
      newComment: '',
      dataLoaded: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pages: 0,
      currentUserInfo: reactive({})
    }
  },
  created() {
    this.getArticleById()
  },
  methods: {
    getArticleById() {
      // 获取文章数据
      axios
        .get(`http://127.0.0.1:5000/article/get/byid?id=${this.id}`)
        .then((response) => {
          if (response.data.code === 200) {
            const data = response.data.data
            this.article = data.article
            this.author = data.author
            this.dataLoaded = true
            // 获取文章评论数据
            this.getCommentsByArticleId(this.id)
          } else {
            this.$message.error('Failed to fetch article:', response.data.message)
          }
        })
        .catch((error) => {
          this.$message.error('Error fetching article:', error)
        })
    },
    getCommentsByArticleId(articleId) {
      // 获取文章评论数据
      axios
        .get(
          `http://127.0.0.1:5000/comment/get/by/article?id=${articleId}&page=${this.currentPage}&per_page=${this.pageSize}`
        )
        .then((response) => {
          if (response.data.code === 200) {
            // 更新评论数据
            this.comments = response.data.data.comments
            this.total = response.data.data.total
            this.pages = response.data.data.pages
          } else {
            this.$message.error('Failed to fetch comments:', response.data.message)
          }
        })
        .catch((error) => {
          this.$message.error('Error fetching comments:', error)
        })
    },
    likeArticle() {
      // 发送 POST 请求
      axios
        .post(
          'http://127.0.0.1:5000/article/like',
          {
            id: this.article.id,
            fp: getCookieValue('fp')
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
        .then((response) => {
          if (response.data.code === 200) {
            // 点赞成功
            this.article.like++
            this.$message.success(response.data.message)
          } else if (response.data.code === 400) {
            // 重复点赞
            this.$message.warning(response.data.message)
          } else {
            // 其他错误
            this.$message.error('点赞失败:', response.data.message)
          }
        })
        .catch((error) => {
          this.$message.error('点赞失败:', error)
        })
    },
    async postComment() {
      // 检查评论内容是否为空或全为空格
      if (!this.newComment || !this.newComment.trim()) {
        this.$message.error('评论内容不能为空')
        return // 结束方法，不执行后续的请求
      }
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/comment/post',
          {
            fp: getCookieValue('fp'),
            comment: this.newComment,
            article: this.id
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )

        // 处理成功响应
        if (response.data.code === 200) {
          // 清空输入框
          this.newComment = ''
          // 通知用户评论发布成功
          this.$message.success(response.data.message)
          // 更新评论列表，重新获取评论数据
          this.getCommentsByArticleId(this.id)
          this.article.comment++
        } else {
          // 其他处理逻辑，例如提示用户评论发布失败等
          this.$message.error(response.data.message)
        }
      } catch (error) {
        // 处理请求失败的情况
        this.$message.error('评论发布失败')
      }
    },
    goToAuthorProfile(authorId) {
      // 假设这里是跳转到作者个人主页的功能
      console.log('跳转到作者个人主页，作者ID为:', authorId)
    },
    handleCommentsPageChange(newPage) {
      this.currentPage = newPage
      // 发送请求获取新页的评论数据
      this.getCommentsByArticleId(this.id)
    },
    async deleteArticle() {
      const articleId = this.article.id
      const fp = getCookieValue('fp')

      const confirmDelete = await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!confirmDelete) {
        ElMessage.info('取消删除评论')
        return
      }

      const url = 'http://127.0.0.1:5000/user/delete/article'
      const data = new URLSearchParams()
      data.append('id', articleId)
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
          ElMessage.info('文章删除成功')
        } else {
          ElMessage.error('文章删除失败: ' + responseData.message)
        }
      } catch (error) {
        ElMessage.error('发生错误: ' + error.message)
      }
    }
  },
  computed: {
    formattedPostTime() {
      const postTime = new Date(this.article.post_time)
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
.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left-section {
  flex: 1;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.author-info {
  display: flex;
  align-items: center;
  margin: 10px 0px;
}

.author-nick {
  font-size: 14px;
  font-weight: bold;
}

.article-title {
  font-size: 40px;
  font-weight: bold;
}

.article-extra {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.article-category {
  font-size: 14px;
  color: #999;
}

.article-info {
  font-size: 14px;
  margin: 10px 0px;
}

.article-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
}

.article-detail {
  padding: 20px;
  margin: 20px 0px;
}

.article-header h1 {
  font-size: 24px;
}

.author-info {
  margin-top: 10px;
}

.author-info span {
  cursor: pointer;
}

.comment {
  margin-bottom: 10px;
}

.comment .comment-content {
  margin-left: 50px;
}

.comment p {
  margin: 5px 0;
}

.comment-author {
  cursor: pointer;
}

.comment-input {
  margin: 30px 0px;
  display: flex;
  align-items: center;
}

.comment-input el-input {
  width: 80%;
  margin-right: 10px;
}

.footer-buttons {
  display: flex;
  flex-shrink: 0;
}
</style>
