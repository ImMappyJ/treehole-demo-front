<template>
  <div class="article-container">
    <ArticleItem
      v-for="article in articles"
      :key="article.id"
      :article="article"
      :author="userInfo"
    />
  </div>
</template>

<script>
import axios from 'axios'
import ArticleItem from '@/components/ArticleItem.vue'
import { getCookieValue } from '@/utils/cookieutils'

export default {
  name: 'UserArticleSetting',
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: []
    }
  },
  props: {
    userInfo: Object
  },
  mounted() {
    while (this.userInfo !== null) {
      console.log(this.userInfo)
      this.fetchArticles()
      return
    }
  },
  methods: {
    async fetchArticles() {
      axios
        .post(
          'http://127.0.0.1:5000/user/get/articles',
          {
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
            this.articles = response.data.data.articles
          } else {
            this.$message.error('Failed to fetch articles:', response.data.message)
          }
        })
        .catch((error) => {
          this.$message.error('Error fetching articles:', error)
        })
    }
  }
}
</script>

<style>

.article-container{
  margin: auto auto;
}

</style>
