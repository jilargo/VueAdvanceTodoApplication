<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>

    <p class="register-link">
      No account? <router-link to="/signUp">Register here</router-link>
    </p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''
  try {
    const res = await axios.post('http://localhost:3000/login', {
      email: email.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.token)
    router.push('/dashboard')
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Login failed'
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
