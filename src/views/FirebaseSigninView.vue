<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
  <div :style="statusStyle.value">
    <div v-if="loginStatus.value">
      <p>{{ loginStatus.title }}</p>
      <p>{{ loginStatus.message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { getUserFromFirestore } from "@/firebase/firestore";

const email = ref("");
const password = ref("");
const router = useRouter();
const auth = getAuth();

// 显示登录状态消息
const loginStatus = ref({
  title: "",
  message: ""
});
const statusStyle = ref("background-color: #e8f7f8; border: 1px solid #00b8d4; padding: 10px; margin-top: 20px; border-radius: 4px;");

const signin = () => {
  console.log("🔥🔥🔥 SIGNIN FUNCTION CALLED 🔥🔥🔥");
  console.log("Email trying to login:", email.value);
  
  // 显示登录进度消息
  loginStatus.value = {
    title: "Attempting to sign in...",
    message: `Email: ${email.value}`
  }
  statusStyle.value = "background-color: #e8f7f8; border: 1px solid #00b8d4; padding: 10px; margin-top: 20px; border-radius: 4px;"
  
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // 登录成功后的操作
      const user = userCredential.user;
      console.log("🎉 FIREBASE LOGIN SUCCESSFUL! 🎉");
      console.log("User credential:", userCredential);
      console.log("User object:", user);
      console.log("Auth current user:", auth.currentUser);
      
      // 从 Firestore 获取用户信息
      getUserFromFirestore(user.uid)
        .then((userData) => {
          if (userData) {
            console.log("User data from Firestore:", userData);
            // 设置用户角色
            userRole.value = userData.role || 'user';
            localStorage.setItem('userRole', userRole.value);
            
            // 显示登录成功消息
            loginStatus.value = {
              title: "LOGIN SUCCESSFUL!",
              message: JSON.stringify({
                ...auth.currentUser,
                role: userRole.value,
                userData: userData
              }, null, 2)
            }
          } else {
            // 如果在 Firestore 中找不到用户数据，使用本地存储的角色
            const savedRole = localStorage.getItem('userRole') || 'user';
            userRole.value = savedRole;
            
            // 显示登录成功消息
            loginStatus.value = {
              title: "LOGIN SUCCESSFUL!",
              message: JSON.stringify(auth.currentUser, null, 2)
            }
          }
          
          statusStyle.value = "background-color: #e8f5e9; border: 1px solid #4caf50; padding: 10px; margin-top: 20px; border-radius: 4px;";
          
          // 保存登录状态
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', auth.currentUser.email);
          
          // 延迟跳转到首页
          setTimeout(() => {
            router.push("/");
          }, 2000);
        })
        .catch((error) => {
          console.error("Error getting user data from Firestore:", error);
          // 如果获取用户数据失败，使用本地存储的角色
          const savedRole = localStorage.getItem('userRole') || 'user';
          userRole.value = savedRole;
          
          // 显示登录成功消息
          loginStatus.value = {
            title: "LOGIN SUCCESSFUL!",
            message: JSON.stringify(auth.currentUser, null, 2)
          }
          statusStyle.value = "background-color: #e8f5e9; border: 1px solid #4caf50; padding: 10px; margin-top: 20px; border-radius: 4px;";
          
          // 保存登录状态
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', auth.currentUser.email);
          
          // 延迟跳转到首页
          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
    })
    .catch((error) => {
      console.log(error.code);
      loginStatus.value = {
        title: "Login Failed",
        message: error.message
      }
      statusStyle.value = "background-color: #ffebee; border: 1px solid #f44336; padding: 10px; margin-top: 20px; border-radius: 4px;"
    });
};

// 用户角色
const userRole = ref(localStorage.getItem('userRole') || 'user');
</script>
