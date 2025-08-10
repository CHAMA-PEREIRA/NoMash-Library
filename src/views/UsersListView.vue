<template>
  <div class="users-container">
    <h1>Users Collection</h1>
    <p class="description">
      This page demonstrates Firestore Collections and Documents by displaying all users in the database.
    </p>
    
    <div v-if="loading" class="loading">
      <p>Loading users...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <div v-else>
      <div class="users-count">
        <p>Total Users: <strong>{{ users.length }}</strong></p>
      </div>
      
      <div class="users-list">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-header">
            <h3>{{ getUserDisplayName(user) }}</h3>
            <span class="badge" :class="getRoleBadgeClass(user.role)">{{ user.role }}</span>
          </div>
          
          <div class="user-details">
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>User ID:</strong> {{ user.id }}</p>
            <p v-if="user.birthday"><strong>Birthday:</strong> {{ user.birthday }}</p>
            <p v-if="user.createdAt"><strong>Created:</strong> {{ formatDate(user.createdAt) }}</p>
          </div>
          
          <div class="user-actions">
            <button @click="toggleUserDetails(user.id)" class="btn-details">
              {{ expandedUsers.includes(user.id) ? 'Hide Details' : 'Show Details' }}
            </button>
          </div>
          
          <div v-if="expandedUsers.includes(user.id)" class="user-json">
            <pre>{{ JSON.stringify(user, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllUsers } from '@/firebase/firestore';

const users = ref([]);
const loading = ref(true);
const error = ref(null);
const expandedUsers = ref([]);

onMounted(async () => {
  try {
    loading.value = true;
    const usersList = await getAllUsers();
    users.value = usersList;
    loading.value = false;
  } catch (err) {
    error.value = `Error loading users: ${err.message}`;
    loading.value = false;
    console.error('Error fetching users:', err);
  }
});

const getUserDisplayName = (user) => {
  if (user.name && (user.name.first || user.name.last)) {
    return `${user.name.first || ''} ${user.name.last || ''}`.trim();
  }
  return user.email.split('@')[0] || 'Unknown User';
};

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'admin':
      return 'badge-admin';
    case 'user':
      return 'badge-user';
    case 'guest':
      return 'badge-guest';
    default:
      return 'badge-default';
  }
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (e) {
    return dateString;
  }
};

const toggleUserDetails = (userId) => {
  if (expandedUsers.value.includes(userId)) {
    expandedUsers.value = expandedUsers.value.filter(id => id !== userId);
  } else {
    expandedUsers.value.push(userId);
  }
};
</script>

<style scoped>
.users-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.description {
  margin-bottom: 20px;
  color: #6c757d;
}

.loading, .error-message {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

.error-message {
  color: #dc3545;
  border: 1px solid #f5c6cb;
}

.users-count {
  margin-bottom: 20px;
  font-size: 18px;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.user-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
}

.user-header h3 {
  margin: 0;
  font-size: 18px;
  color: #343a40;
}

.badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-admin {
  background-color: #dc3545;
  color: white;
}

.badge-user {
  background-color: #28a745;
  color: white;
}

.badge-guest {
  background-color: #6c757d;
  color: white;
}

.badge-default {
  background-color: #17a2b8;
  color: white;
}

.user-details {
  margin-bottom: 15px;
}

.user-details p {
  margin: 5px 0;
  font-size: 14px;
}

.user-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-details {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-details:hover {
  background-color: #5a6268;
}

.user-json {
  margin-top: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
  overflow-x: auto;
}

.user-json pre {
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .users-list {
    grid-template-columns: 1fr;
  }
}
</style>