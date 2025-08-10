<template>
  <div id="app">
    <div class="search-box">
      <input
        type="text"
        class="search-bar"
        placeholder="Enter city name"
        v-model="city"
        @keypress.enter="fetchWeatherByCity" />
      <button @click="fetchWeatherByCity">Search</button>
    </div>

    <main v-if="weatherData">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div>
        <img :src="iconUrl" alt="Weather Icon" />
        <p>{{ temperature }} °C</p>
      </div>
      <span>{{ weatherData.weather[0].description }}</span>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data() {
    return {
      // 绑定到输入框的城市名
      city: "",
      // 存储从API获取到的天气数据
      weatherData: null,
      // 你代码中提到的 hourlyForecast 和 dailyForecast 变量，这里先不用，因为提供的代码只获取当前天气
      hourlyForecast: [],
      dailyForecast: [],
    };
  },
  // computed 属性用于派生数据，当依赖的数据改变时，它们会自动更新
  computed: {
    temperature() {
      // 直接使用 API 返回的温度，因为 API 调用时已经指定了 units=metric（摄氏度）
      // 如果没有指定 units=metric，则需要将开尔文（K）转换为摄氏度（C）：Math.floor(this.weatherData.main.temp - 273.15)
      return this.weatherData ? Math.floor(this.weatherData.main.temp) : null;
    },
    iconUrl() {
      // 拼接出天气图标的URL
      return this.weatherData ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png` : null;
    },
  },
  methods: {
    // 根据城市名称获取天气数据的方法
    async fetchWeatherByCity() {
      const apikey = "03a670750ad30f9e3fec687346899502"; // ⚠️ 请将这里替换为你的真实API密钥
      if (!this.city) {
        alert("city name");
        return;
      }
      try {
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}&units=metric`;
        const response = await axios.get(url);
        // 将获取到的数据赋值给 weatherData
        this.weatherData = response.data;
      } catch (error) {
        console.error("获取天气数据时出错:", error);
        alert("无法找到该城市的天气。请重试。");
      }
    },
    // 根据当前地理位置获取天气数据的方法
    async fetchCurrentLocationWeather() {
      const apikey = "03a670750ad30f9e3fec687346899502"; // ⚠️ 请将这里替换为你的真实API密钥
      // 检查浏览器是否支持地理定位
      if (navigator.geolocation) {
        // 请求用户位置
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          // 拼接出使用经纬度的 API URL
          const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
          try {
            const response = await axios.get(url);
            this.weatherData = response.data;
          } catch (error) {
            console.error("获取天气数据时出错:", error);
          }
        });
      } else {
        alert("该浏览器不支持地理定位功能。");
      }
    },
  },
  // mounted 是一个生命周期钩子函数，在组件挂载到DOM后立即执行
  // 我们在这里调用获取当前位置天气的方法，以便应用一加载就能显示数据
  mounted() {
    this.fetchCurrentLocationWeather();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.search-box {
  margin-bottom: 20px;
}
.search-bar {
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  width: 250px;
}
</style>
