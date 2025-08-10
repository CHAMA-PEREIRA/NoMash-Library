<template>
  <div class="book-list">
    <h2>Book List</h2>
    <div v-if="books.length === 0" class="no-books">
      No books available
    </div>
    <ul v-else>
      <li v-for="book in books" :key="book.id" class="book-item">
        <div class="book-info">
          <strong>{{ book.name }}</strong>
          <span class="isbn">ISBN: {{ book.isbn }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '../firebase/init.js';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const booksCollection = collection(db, 'books');
        const booksQuery = query(booksCollection, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(booksQuery);
        
        books.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    onMounted(fetchBooks);

    return {
      books
    };
  }
};
</script>

<style scoped>
.book-list {
  margin-top: 20px;
}

.no-books {
  font-style: italic;
  color: #666;
  margin: 20px 0;
}

ul {
  list-style: none;
  padding: 0;
}

.book-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
}

.book-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.isbn {
  color: #666;
  font-size: 0.9em;
}
</style>