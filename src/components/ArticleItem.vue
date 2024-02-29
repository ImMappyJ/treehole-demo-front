<template>
  <router-link :to="`/article/${article.id}`" class="card-link">
    <el-card
      class="article-card"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
      :style="{ transform: isHovered ? 'scale(1.01)' : 'scale(1)' }"
    >
      <template #header>
        <div class="article-header">
          <!-- 左边部分 -->
          <div class="left-section">
            <div class="article-title">{{ article.title }}</div>
            <div class="author-info">
              <el-icon>
                <Avatar />
              </el-icon>
              <div class="author-nick">{{ author.nick }}</div>
            </div>
            <div class="article-info">
              <el-icon><Clock /></el-icon>{{ formattedPostTime }}
            </div>
          </div>
          <!-- 右边部分 -->
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
          </div>
        </div>
      </template>
      <div class="article-content" :style="{ '-webkit-line-clamp': '2' }">
        {{ article.context }}
      </div>
      <template #footer>
        <div class="article-footer">
          <span>
            <el-icon>
              <View />
            </el-icon>
            {{ article.view }}
          </span>
          <span>
            <el-icon>
              <Comment />
            </el-icon>
            {{ article.comment }}
          </span>
          <span>
            <el-icon>
              <Pointer />
            </el-icon>
            {{ article.like }}
          </span>
          <!-- <el-link v-if="userInfo.id === author.id || userInfo.group === 1">
            <el-icon><DeleteFilled /></el-icon>
            删除
          </el-link> -->
        </div>
      </template>
    </el-card>
  </router-link>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    },
    author: {
      type: Object,
      required: true
    },
    userInfo: Object
  },
  data() {
    return {
      isHovered: false
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
.article-card {
  margin: 20px 0px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.left-section {
  flex: 1;
  /* 占据左边的空间 */
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

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.author-nick {
  font-size: 14px;
  font-weight: bold;
}

.article-title {
  font-size: 18px;
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
  margin-bottom: 10px;
}

.article-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-footer {
  display: flex;
  justify-content: space-between;
}

.article-footer span {
  display: flex;
  align-items: center;
}

.article-footer el-icon {
  margin-right: 10px;
}

.card-link {
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 继承父级颜色 */
}
</style>
