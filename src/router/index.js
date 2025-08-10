import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import LogoutView from '@/views/LogoutView.vue'
import UsersListView from '@/views/UsersListView.vue'
import AddBookView from '@/views/AddBookView.vue'
import SearchBooksView from '@/views/SearchBooksView.vue'


//Route configurations
import WeatherView from '../views/WeatherView.vue'
import CountBookAPI from '../views/CountBookAPI.vue';
import GetAllBookAPI from '../views/GetAllBookAPI.vue';

const routes = [

  {
        path: '/WeatherCheck',  // 访问路径不变
        name: 'GetWeather',     // 路由名称改为 GetWeather
        component: WeatherView
    },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/profile',
    name: 'Profile',
    component: LogoutView,
    meta: {
      requiresAuth: true,
      title: 'User Profile - Library Management System'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home - Library Management System'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true,
      title: 'About - Library Management System'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Login - Library Management System'
    }
  },
  {    path: '/access-denied',    name: 'AccessDenied',    component: AccessDeniedView,    meta: {      title: 'Access Denied - Library Management System'    }  },
  {
    path: '/users',
    name: 'UsersList',
    component: UsersListView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Users List - Library Management System'
    }
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView,
    meta: {
      requiresAuth: true,
      title: 'Add Book - Library Management System'
    }
  },
  {
    path: '/CountBookAPI',
    name: 'CountBookAPI',
    component: CountBookAPI
  },
  {
    path: '/GetAllBookAPI',
    name: 'GetAllBookAPI',
    component: GetAllBookAPI
  },
  {
    path: '/search-books',
    name: 'SearchBooks',
    component: SearchBooksView,
    meta: {
      title: 'Search Books - Library Management System'
    }
  }
]

/**
 * Router Instance Creation
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

/**
 * Authentication check
 * @returns {boolean} Whether the user is authenticated
 */
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

/**
 * Admin role check
 * @returns {boolean} Whether the user has admin role
 */
const isAdmin = () => {
  return localStorage.getItem('userRole') === 'admin'
}

/**
 * Navigation Guards
 */
router.beforeEach((to, from, next) => {
  // Update page title
  document.title = to.meta.title || 'Library Management System'

  // Authentication check
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({
      path: '/access-denied',
      query: { redirect: to.fullPath }
    })
  }
  // Admin role check
  else if (to.meta.requiresAdmin && !isAdmin()) {
    next({
      path: '/access-denied',
      query: { message: 'This page requires administrator privileges.' }
    })
  }
  // Prevent authenticated users from accessing login
  else if ((to.path === '/login' || to.path === '/FireLogin') && isAuthenticated()) {
    next({ path: '/' })
  }
  // Allow navigation
  else {
    next()
  }
})

export default router
