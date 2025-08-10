<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from 'firebase/auth'

const router = useRouter()
const auth = getAuth()
const isAuthenticated = ref(false)
const username = ref('')
const userRole = ref('')

onMounted(() => {
  checkAuthStatus()
})

const checkAuthStatus = () => {
  isAuthenticated.value = localStorage.getItem('isAuthenticated') === 'true'
  username.value = localStorage.getItem('user') || ''
  userRole.value = localStorage.getItem('userRole') || 'user'
}

const logout = () => {
  // Firebase注销
  signOut(auth).then(() => {
    console.log('🔥 FIREBASE LOGOUT SUCCESSFUL! 🔥')
    console.log('User credential:', auth.currentUser)

    // 清除本地存储
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')

    // 更新状态
    isAuthenticated.value = false
    username.value = ''
    userRole.value = ''

    // 跳转到登录页
    router.push('/FireLogin')
  }).catch((error) => {
    console.log(error.code)
  })
}
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/addbook" class="nav-link" active-class="active">Add Book</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/search-books" class="nav-link" active-class="active">Search Books</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/Firelogin" class="nav-link" active-class="active">Firebase Login</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active">Firebase Register</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">
              Get Weather
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active">Count Book API</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">Get All Book API</router-link>
        </li>
      </ul>

      <div v-if="isAuthenticated" class="d-flex align-items-center">
        <span class="me-3">Welcome, {{ username }} <small class="badge bg-info text-white">Role: {{ userRole }}</small></span>
        <router-link to="/profile" class="btn btn-outline-primary btn-sm me-2">Profile</router-link>
        <router-link to="/addbook" class="btn btn-outline-primary btn-sm me-2">Add Book</router-link>
        <router-link to="/search-books" class="btn btn-outline-primary btn-sm me-2">Search Books</router-link>
        <router-link v-if="userRole === 'admin'" to="/users" class="btn btn-outline-success btn-sm me-2">Users List</router-link>
        <button class="btn btn-outline-danger btn-sm" @click="logout">Sign Out</button>
      </div>
      <div v-else class="d-flex align-items-center">
        <router-link to="/FireLogin" class="btn btn-primary btn-sm me-2">Firebase Sign In</router-link>
        <router-link to="/login" class="btn btn-outline-primary btn-sm">Regular Sign In</router-link>
      </div>
    </header>
  </div>
</template>

<style scoped>
.nav-link {
  color: #333;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #0d6efd;
}

.nav-link.active {
  background-color: #0d6efd !important;
}

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.text-small {
  font-size: 85%;
}

.dropdown-toggle {
  outline: 0;
}
</style>
