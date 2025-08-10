<template>
  <div class="logout-container">
    <h1>User Profile & Logout</h1>
    
    <div v-if="currentUser" class="user-info">
      <h2>Current User Information</h2>
      <div class="info-card">
        <p><strong>Email:</strong> {{ currentUser.email }}</p>
        <p><strong>User ID:</strong> {{ currentUser.uid }}</p>
        <p><strong>Role:</strong> {{ userRole }}</p>
        <p><strong>Last Login:</strong> {{ new Date(parseInt(currentUser.lastLoginAt)).toLocaleString() }}</p>
        
        <div v-if="userData" class="user-details">
          <h3>User Details</h3>
          <div class="edit-field">
            <label>First Name:</label>
            <input v-model="userData.name.first" type="text" placeholder="Enter first name" />
          </div>
          <div class="edit-field">
            <label>Last Name:</label>
            <input v-model="userData.name.last" type="text" placeholder="Enter last name" />
          </div>
          <div class="edit-field">
            <label>Birthday:</label>
            <input v-model="userData.birthday" type="text" placeholder="YYYY-MM-DD" />
          </div>
          <button @click="updateUserData" class="update-btn">Update Profile</button>
          <p v-if="updateMessage" :class="updateStatus ? 'success-message' : 'error-message'">{{ updateMessage }}</p>
        </div>
      </div>
      
      <div class="console-output">
        <h3>Developer Console</h3>
        <pre>{{ JSON.stringify(userData || currentUser, null, 2) }}</pre>
      </div>
      
      <button @click="logout" class="logout-btn">Sign Out</button>
    </div>
    
    <div v-else class="not-logged-in">
      <p>You are not currently logged in.</p>
      <router-link to="/FireLogin" class="login-link">Go to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getUserFromFirestore, saveUserToFirestore } from '@/firebase/firestore';

const auth = getAuth();
const router = useRouter();
const currentUser = ref(null);
const userRole = ref('');
const userData = ref(null);
const updateMessage = ref('');
const updateStatus = ref(false);

onMounted(() => {
  // 检查用户是否已登录
  currentUser.value = auth.currentUser;
  userRole.value = localStorage.getItem('userRole') || 'user';
  
  console.log('Auth current user:', auth.currentUser);
  
  // 如果用户已登录，从 Firestore 获取用户数据
  if (auth.currentUser) {
    getUserFromFirestore(auth.currentUser.uid)
      .then((data) => {
        if (data) {
          userData.value = data;
          console.log('User data from Firestore:', data);
        } else {
          console.log('No user data found in Firestore');
          // 如果没有找到用户数据，创建一个基本的用户数据对象
          userData.value = {
            email: auth.currentUser.email,
            role: userRole.value,
            createdAt: new Date().toISOString(),
            name: {
              first: '',
              last: ''
            },
            birthday: ''
          };
        }
      })
      .catch((error) => {
        console.error('Error getting user data:', error);
      });
  }
});

// 更新用户数据
const updateUserData = () => {
  if (!auth.currentUser) return;
  
  updateMessage.value = 'Updating profile...';
  updateStatus.value = false;
  
  // 保存用户数据到 Firestore
  saveUserToFirestore(auth.currentUser.uid, userData.value)
    .then(() => {
      updateMessage.value = 'Profile updated successfully!';
      updateStatus.value = true;
      setTimeout(() => {
        updateMessage.value = '';
      }, 3000);
    })
    .catch((error) => {
      updateMessage.value = `Error updating profile: ${error.message}`;
      updateStatus.value = false;
    });
};

const logout = () => {
  signOut(auth).then(() => {
    console.log('🔥 FIREBASE LOGOUT SUCCESSFUL! 🔥');
    
    // 清除本地存储
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    
    // 更新状态
    currentUser.value = null;
    
    // 显示注销成功消息
    alert('You have been successfully logged out!');
    
    // 跳转到登录页
    router.push('/FireLogin');
  }).catch((error) => {
    console.log(error.code);
    alert('Logout failed: ' + error.message);
  });
};
</script>

<style scoped>
.logout-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  margin-top: 20px;
}

.info-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
}

.edit-field {
  margin-bottom: 15px;
}

.edit-field label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.edit-field input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
}

.update-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.update-btn:hover {
  background-color: #218838;
}

.success-message {
  color: #28a745;
  margin-top: 10px;
}

.error-message {
  color: #dc3545;
  margin-top: 10px;
}

.console-output {
  background-color: #212529;
  color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.console-output pre {
  margin: 0;
  white-space: pre-wrap;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.not-logged-in {
  text-align: center;
  margin-top: 40px;
}

.login-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>