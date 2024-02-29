<template>
    <div>
      <ArticleItem
        v-for="article in articles"
        :key="article.article.id"
        :article="article.article"
        :author="article.author"
        :user-info="userInfo"
      />
      <el-pagination
        @current-change="handlePageChange"
        :current-page="page"
        :page-size="per_page"
        :page-count="totalPages"
        layout="prev, pager, next"
        :hide-on-single-page="true"
        class="pagination-center"
      />
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import ArticleItem from '@/components/ArticleItem.vue'
  import { ref } from 'vue'
  
  export default {
    name: 'HomePage',
    components: {
      ArticleItem
    },
    data() {
      return {
        articles: [],
        page: ref(1),
        per_page: 10, // 每页显示的数量
        totalPages: ref(0) // 总页数
      }
    },
    props: {
      userInfo: Object
    },
    mounted() {
      this.fetchArticles()
    },
    methods: {
      fetchArticles() {
        axios
          .get(`http://127.0.0.1:5000/article/rank?page=${this.page}&per_page=${this.per_page}`)
          .then((response) => {
            if (response.data.code === 200) {
              this.articles = response.data.data.articles
              this.totalPages = response.data.data.total_pages
            } else {
              console.error('Failed to fetch articles:', response.data.message)
            }
          })
          .catch((error) => {
            console.error('Error fetching articles:', error)
          })
      },
      handlePageChange(page) {
        this.page = page
        this.fetchArticles()
      }
    }
  }
  </script>
  
  <style>
  .pagination-center {
    display: flex;
    justify-content: center;
    margin-top: 20px; /* 调整垂直位置 */
  }
  
  .el-pagination {
    font-size: 18px; /* 设置分页器字体大小 */
  }
  </style>
  