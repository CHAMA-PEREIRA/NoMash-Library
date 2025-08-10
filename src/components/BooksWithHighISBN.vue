<template>
  <div class="high-isbn-books">
    <h2>Books with ISBN > 1000</h2>
    <div v-if="books.length === 0" class="no-books">
      No books with ISBN > 1000 available
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
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const books = ref([]);

    const fetchBooks = async () => {
      try {
        const q = query(collection(db, 'books'), where('isbn', '>', 1000));
        const querySnapshot = await getDocs(q);
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        books.value = booksArray;
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    onMounted(() => {
      fetchBooks();
    });

    return {
      books
    };
  }
};
</script>

<style scoped>
.high-isbn-books {
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