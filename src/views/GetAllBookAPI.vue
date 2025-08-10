<template>
  <div v-if="apiResponse" class="api-response">
    <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const authors = ref([]);
const loading = ref(false);
const error = ref(null);
const apiResponse = ref(null);

const getAllBooks = async () => {
  loading.value = true;
  error.value = null;

  try {
    // 从本地 JSON 文件获取数据
    const response = await fetch('src/assets/json/authors.json');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    authors.value = data;

  } catch (err) {
    error.value = `Error loading authors data: ${err.message}`;
    console.error('Error loading authors data:', err);
  } finally {
    loading.value = false;
  }

  // 构建 API 响应对象
  apiResponse.value = {
    success: true,
    data: {
      authors: authors.value.map(author => ({
        name: author.name,
        famousWorks: author.famousWorks
      }))
    },
    timestamp: new Date().toISOString()
  };
};

onMounted(() => {
  getAllBooks();
});
</script>

<style scoped>
.api-response {
  text-align: left;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 1rem;
}
</style>
