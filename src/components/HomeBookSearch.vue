<template>
  <div class="home-book-search">
    <h3>Quick Book Search</h3>
    <p class="info-text">Find books in our library by ISBN or name</p>
    
    <!-- 使用BookQuery组件，但限制结果数量为3 -->
    <BookQuery :limit="3" />
    
    <div class="view-all">
      <router-link to="/search-books" class="view-all-link">
        View all search options
        <span class="arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import BookQuery from './BookQuery.vue';

export default defineComponent({
  name: 'HomeBookSearch',
  components: {
    BookQuery
  }
});
</script>

<style scoped>
.home-book-search {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
}

.info-text {
  color: #6c757d;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.view-all {
  margin-top: 15px;
  text-align: right;
}

.view-all-link {
  color: #0d6efd;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
}

.view-all-link:hover {
  text-decoration: underline;
}

.arrow {
  margin-left: 5px;
  transition: transform 0.2s;
}

.view-all-link:hover .arrow {
  transform: translateX(3px);
}
</style>