<script setup>
import { RouterView } from 'vue-router'
import JSONLab from './components/JSONLab.vue'
import BHeader from './components/BHeader.vue'
//import LibraryRegistrationForm from './components/LibraryRegistrationForm.vue'
</script>

<template>
  <div class="main-container">
    <header>
      <BHeader />
    </header>

    <main class="main-box">

      <router-view></router-view>
    </main>
  </div>
</template>

