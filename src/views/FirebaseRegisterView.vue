<template>
    <h1>Create an Account</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p>
        <label>Select Role: </label>
        <select v-model="role">
            <option value="admin">Administrator</option>
            <option value="user">Regular User</option>
            <option value="guest">Guest</option>
        </select>
    </p>
    <p><button @click="register">Save to Firebase</button></p>
    <div v-if="message" :style="messageStyle">{{ message }}</div>
</template>

<script setup>
import { ref } from "vue"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { saveUserToFirestore } from "@/firebase/firestore"

const email = ref("")
const password = ref("")
const role = ref("user")
const message = ref("")
const messageStyle = ref("")
const router = useRouter()
const auth = getAuth()

const register = () => {
    message.value = ""
    
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            console.log("Firebase Register Successful!")
            const user = userCredential.user
            
            // 创建用户数据对象
            const userData = {
                email: email.value,
                role: role.value,
                createdAt: new Date().toISOString(),
                name: {
                    first: "",
                    last: ""
                },
                birthday: ""
            }
            
            // 保存用户数据到 Firestore
            saveUserToFirestore(user.uid, userData)
                .then(() => {
                    console.log("User data saved to Firestore")
                })
                .catch((error) => {
                    console.error("Error saving user data:", error)
                })
            
            message.value = `Registration successful! User created with role: ${role.value}`
            messageStyle.value = "color: green; margin-top: 10px;"
            
            localStorage.setItem('userRole', role.value)
            
            setTimeout(function() {
                router.push("/FireLogin")
            }, 2000)
        })
        .catch((error) => {
            console.log(error.code)
            message.value = `Registration failed: ${error.message}`
            messageStyle.value = "color: red; margin-top: 10px;"
        })
}
</script>
