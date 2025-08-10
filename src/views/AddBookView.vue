<template>
  <div>
    <h1>Add Book</h1>
    <form @submit.prevent="addBook">
      <div>
        <label for="isbn">ISBN:</label>
        <input type="text" v-model="isbn" id="isbn" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <button type="submit">Add Book</button>
    </form>
    
    <div class="book-sections">
      <div class="section">
        <h2>All Books</h2>
        <BookList />
      </div>
      
      <div class="section">
        <BookQuery :limit="5" />
      </div>
      
      <div class="section">
        <BooksWithHighISBN />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore';

import BookList from '../components/BookList.vue';
import BookQuery from '../components/BookQuery.vue';
import BooksWithHighISBN from '../components/BooksWithHighISBN.vue';

export default {
  name: 'AddBookView',
  setup() {
    const isbn = ref('');
    const name = ref('');

    const addBook = async () => {
      try {
        // Convert isbn to number
        const isbnNumber = Number(isbn.value);
        
        // Validate that isbn is a valid number
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }
        
        // Add document to Firestore
        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value,
          createdAt: new Date()
        });
        
        // Reset form
        isbn.value = '';
        name.value = '';
        
        alert('Book added successfully!');
      } catch (error) {
        console.error('Error adding book: ', error);
        alert('Error adding book: ' + error.message);
      }
    };

    return {
      isbn,
      name,
      addBook
    };
  },
  components: {
    BookList,
    BookQuery,
    BooksWithHighISBN
  }
};
</script>

<style scoped>
form div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  padding: 8px;
  width: 300px;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.book-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 30px;
}

.section {
  flex: 1;
  min-width: 300px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
}

.section h2 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
</style>