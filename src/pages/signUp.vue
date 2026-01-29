<template>
  <div class="signup-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <!-- Name Fields -->
      <div class="name-fields">
        <input
          type="text"
          v-model="firstName"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          v-model="lastName"
          placeholder="Last Name"
          required
        />
      </div>

      <!-- Email & Password -->
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />

      <!-- Profile Picture Upload -->
      <div class="file-upload">
        <input type="file" @change="handleFileUpload" accept="image/*" />
        <div v-if="previewImage" class="preview">
          <img :src="previewImage" alt="Profile Preview" />
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit">Register</button>
    </form>

    <!-- Messages -->
    <p class="login-link">
      Already have an account? <router-link to="/login">Login here</router-link>
    </p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const profilePicture = ref<File | null>(null)
const previewImage = ref<string | null>(null)
const errorMessage = ref('')
const successMessage = ref('')
const router = useRouter()

// Handle file upload and preview
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Optional: limit file size
    if (file.size > 2 * 1024 * 1024) {
      errorMessage.value = 'File size should be less than 2MB'
      profilePicture.value = null
      previewImage.value = null
      return
    }

    profilePicture.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Password match check
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords don't match"
    return
  }

  // FormData for file upload
  const formData = new FormData()
  formData.append('firstName', firstName.value)
  formData.append('lastName', lastName.value)
  formData.append('email', email.value)
  formData.append('password', password.value)
  if (profilePicture.value) {
    formData.append('profilePicture', profilePicture.value)
  }

  try {
    await axios.post('http://localhost:3000/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
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
  max-width: 450px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.name-fields {
  display: flex;
  gap: 1rem;
}

.name-fields input {
  flex: 1;
}

.file-upload {
  margin-bottom: 1rem;
}

.file-upload .preview {
  margin-top: 0.5rem;
}

.file-upload .preview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #10b981;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
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
