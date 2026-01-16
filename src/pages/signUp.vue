<template>
  <div class="signup-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
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
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        required
      />
      <button type="submit">Register</button>
    </form>

    <p class="login-link">
      Already have an account? <router-link to="/login">Login here</router-link>
    </p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords don't match"
    return
  }

  try {
    await axios.post('http://localhost:3000/signup', {
      email: email.value,
      password: password.value
    })
    successMessage.value = 'Account created! Redirecting to login...'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (err: any) {
    errorMessage.value = err.response?.data?.error || 'Registration failed'
  }
}
</script>

<style scoped>
.signup-container {
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
  background-color: #10b981;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #059669;
}

.login-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.login-link a {
  color: #10b981;
  text-decoration: underline;
}

.error {
  color: red;
  margin-top: 0.5rem;
}

.success {
  color: green;
  margin-top: 0.5rem;
}
</style>
