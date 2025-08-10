<template>
  <div class="book-query">
    <h2>Search Books</h2>
    <div class="search-form">
      <div class="search-field">
        <label for="searchType">Search by:</label>
        <select v-model="searchType" id="searchType">
          <option value="isbn">ISBN</option>
          <option value="name">Book Name</option>
        </select>
      </div>
      
      <div class="search-field">
        <label for="searchValue">Search value:</label>
        <input 
          type="text" 
          v-model="searchValue" 
          id="searchValue" 
          :placeholder="searchType === 'isbn' ? 'Enter ISBN number' : 'Enter book name'"
        />
      </div>
      
      <button @click="searchBooks" class="search-button">Search</button>
      <button @click="clearSearch" class="clear-button">Clear</button>
    </div>
    
    <div v-if="loading" class="loading">
      Loading...
    </div>
    
    <div v-else>
      <div v-if="searchPerformed && searchResults.length === 0" class="no-results">
        No books found matching your search criteria
      </div>
      
      <ul v-if="searchResults.length > 0" class="results-list">
        <li v-for="book in searchResults" :key="book.id" class="book-item">
          <div class="book-info">
            <strong>{{ book.name }}</strong>
            <span class="isbn">ISBN: {{ book.isbn }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import db from '../firebase/init.js';

export default {
  name: 'BookQuery',
  props: {
    // Optional prop to limit the number of results
    limit: {
      type: Number,
      default: 10
    }
  },
  setup(props) {
    const searchType = ref('name');
    const searchValue = ref('');
    const searchResults = ref([]);
    const loading = ref(false);
    const searchPerformed = ref(false);
    
    const isValidSearch = computed(() => {
      if (!searchValue.value.trim()) return false;
      
      if (searchType.value === 'isbn') {
        // Check if the search value is a valid number for ISBN searches
        return !isNaN(Number(searchValue.value));
      }
      
      return true;
    });
    
    const searchBooks = async () => {
      if (!isValidSearch.value) {
        alert(searchType.value === 'isbn' 
          ? 'Please enter a valid ISBN number' 
          : 'Please enter a book name');
        return;
      }
      
      loading.value = true;
      searchPerformed.value = true;
      
      try {
        const booksCollection = collection(db, 'books');
        let q;
        
        if (searchType.value === 'isbn') {
          // For ISBN, we do an exact match with the number
          const isbnNumber = Number(searchValue.value);
          q = query(booksCollection, where('isbn', '==', isbnNumber), orderBy('createdAt', 'desc'));
        } else {
          // For name, we could use startsWith if Firestore supported it
          // As a workaround, we'll fetch all books and filter client-side
          q = query(booksCollection, orderBy('name'), orderBy('createdAt', 'desc'));
        }
        
        const querySnapshot = await getDocs(q);
        
        if (searchType.value === 'name') {
          // Client-side filtering for name searches
          const searchLower = searchValue.value.toLowerCase();
          searchResults.value = querySnapshot.docs
            .filter(doc => doc.data().name.toLowerCase().includes(searchLower))
            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        } else {
          // Direct results for ISBN searches
          searchResults.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        
        // Apply limit if specified
        if (props.limit > 0 && searchResults.value.length > props.limit) {
          searchResults.value = searchResults.value.slice(0, props.limit);
        }
      } catch (error) {
        console.error('Error searching books:', error);
        alert('Error searching books: ' + error.message);
      } finally {
        loading.value = false;
      }
    };
    
    const clearSearch = () => {
      searchValue.value = '';
      searchResults.value = [];
      searchPerformed.value = false;
    };
    
    return {
      searchType,
      searchValue,
      searchResults,
      loading,
      searchPerformed,
      searchBooks,
      clearSearch
    };
  }
};
</script>

<style scoped>
.book-query {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.search-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  align-items: flex-end;
}

.search-field {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

select, input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 200px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.search-button {
  background-color: #4CAF50;
  color: white;
}

.clear-button {
  background-color: #f44336;
  color: white;
}

.loading {
  text-align: center;
  padding: 20px;
  font-style: italic;
  color: #666;
}

.no-results {
  padding: 15px;
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  color: #856404;
  margin-bottom: 15px;
}

.results-list {
  list-style: none;
  padding: 0;
}

.book-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: white;
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