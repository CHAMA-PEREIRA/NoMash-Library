<template>
  <div class="search-books-view">
    <h1>Search Books</h1>
    <p class="description">
      Use the search component below to find books by ISBN or name.
      This demonstrates how the BookQuery component can be reused in different pages.
    </p>
    
    <div class="search-container">
      <BookQuery />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import BookQuery from '../components/BookQuery.vue';

export default defineComponent({
  name: 'SearchBooksView',
  components: {
    BookQuery
  }
});
</script>

<style scoped>
.search-books-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.description {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.search-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}
</style>