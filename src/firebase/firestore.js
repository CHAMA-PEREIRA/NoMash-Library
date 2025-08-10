import { getFirestore, collection, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyAamVWFh6fi5feduPzZuNy3Jl9dlqOUG4s",
  authDomain: "lab7-fit5032-menghao.firebaseapp.com",
  projectId: "lab7-fit5032-menghao",
  storageBucket: "lab7-fit5032-menghao.firebasestorage.app",
  messagingSenderId: "584277169174",
  appId: "1:584277169174:web:012bd00607de86a93dd137"
};

// 初始化 Firebase
let app;
try {
  // 尝试获取已存在的 Firebase 应用实例
  app = initializeApp(firebaseConfig);
} catch (error) {
  // 如果已经初始化，则使用现有实例
  console.log('Firebase already initialized, using existing app');
  app = initializeApp(firebaseConfig, 'secondary');
}

const db = getFirestore(app);
const auth = getAuth(app);

/**
 * 将用户信息保存到 Firestore
 * @param {string} userId - 用户ID
 * @param {Object} userData - 用户数据
 * @returns {Promise}
 */
export const saveUserToFirestore = async (userId, userData) => {
  try {
    // 创建用户文档引用
    const userRef = doc(db, 'users', userId);
    // 保存用户数据
    await setDoc(userRef, userData);
    console.log('User data saved to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @returns {Promise<Object|null>}
 */
export const getUserFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No such user document!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * 获取所有用户
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => {
      return { id: doc.id, ...doc.data() };
    });
    return userList;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export { db, auth };