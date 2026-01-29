<template>
  <div class="todo-card">
  <!-- Calendar Top Right -->
  <div class="calendar-container">
      <button @click="toggleCalendar" class="calendar-btn">📅</button>
      <input 
        v-if="showCalendar" 
        type="date" 
        v-model="selectedDate" 
        class="calendar-popup" 
      />
    </div>

  <!-- Header -->
  <div class="header" v-if="loggedInUser">
    <div class="profile-section">
      <img :src="`http://localhost:3000/${loggedInUser.profilePicture}`" class="profile-picture" alt="Profile" />
      <div class="user-info">
        <p class="user-name">{{ loggedInUser.firstName }} {{ loggedInUser.lastName }}</p>
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </div>

  <!-- Title -->
  <h1 class="title">Advanced Todo Application</h1>

  <!-- Add Todo -->
  <div class="input-group">
    <input v-model="newTodo" placeholder="Add a new task..." />
    <button class="add-btn" @click="addTask">➕ Add</button>
  </div>

  <!-- Todo List -->
  
  <div class="todo-list-container">
  <ul>
    <li v-for="todo in todos" :key="todo.id" class="todo-item">
      {{ todo.title }} - {{ todo.date }}
      <button @click="removeTask(todo.id)">🗑️</button>
    </li>
  </ul>
</div>


</div>

</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

interface Todo {
  id: number
  title: string
  date: string
}

interface User {
  firstName: string
  lastName: string
  profilePicture: string
}




const newTodo = ref('')
const todos = ref<Todo[]>([])
const loggedInUser = ref<User | null>(null)
const notification = ref('')
const showNotification = ref(false)

// Load todos and user data
onMounted(async () => {
  const token = localStorage.getItem('token')
  if (!token) return

  // Fetch todos
  try {
    const res = await axios.get('http://localhost:3000/todos', {
      headers: { Authorization: `Bearer ${token}` }
    })
    todos.value = res.data
  } catch (err) {
    console.error('Failed to load todos', err)
  }

  // Load logged in user
  const userData = localStorage.getItem('loggedInUser')
  if (userData) loggedInUser.value = JSON.parse(userData)
})

//calendar
const showCalendar = ref(false)
const selectedDate = ref<string>('')

// Toggle calendar visibility
function toggleCalendar() {
  showCalendar.value = !showCalendar.value
}
const router = useRouter()
function logout() {
  // Clear user data
  localStorage.removeItem('token')
  localStorage.removeItem('loggedInUser')
  loggedInUser.value = null

  // Redirect to login page
  router.push('/login')
}
// Add new todo
async function addTask() {
  // Validate title and date
  if (!newTodo.value.trim()) return alert('Task title is required!')
  if (!selectedDate.value) return alert('Please select a date!')

  const token = localStorage.getItem('token')
  if (!token) return alert('No token found!')

  try {
    const res = await axios.post(
      'http://localhost:3000/todos',
      { 
        title: newTodo.value,
        date: selectedDate.value
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    todos.value.unshift({ ...res.data, completed: false })
    newTodo.value = ''
    selectedDate.value = ''
    showCalendar.value = false
  } catch (err) {
    console.error('Failed to add todo', err)
  }
}

// Remove a todo
async function removeTask(id: number) {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    await axios.delete(`http://localhost:3000/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    todos.value = todos.value.filter(todo => todo.id !== id)

    notification.value = 'Task removed'
    showNotification.value = true
    setTimeout(() => (showNotification.value = false), 2000)
  } catch (err) {
    console.error('Failed to delete todo', err)
  }
}
</script>
<style>
.app-container {
  display: flex;
  justify-content: center; /* horizontal center of the card */
  align-items: center;     /* vertical center of the card */
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2f7, #f9fafb);
  font-family: 'Inter', Arial, sans-serif;
}

/* Only center the card itself, not its inner content */
.todo-card {
  position: relative;
  background: white;
  padding: 32px;
  width: 520px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);

  /* Ensure inner content stays left-aligned */
  display: block;
}

/* Header and profile */
.header {
  display: flex;
  margin-bottom: 24px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-picture {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #22c55e;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.logout-btn {
  margin-top: 4px;
  padding: 6px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
}

.logout-btn:hover {
  background: #dc2626;
}

/* Title */
.title {
  text-align: center;
  font-size: 1.9rem;
  margin-bottom: 24px;
  font-weight: 700;
}

/* Input group */
.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
}

.add-btn {
  padding: 12px 18px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

/* Todo list */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.todo-item {
  margin-bottom: 10px;  /* keep spacing between todos */
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 10px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

/* Toast */
.toast {
  position: fixed;
  top: 30px;
  right: 30px;
  background: #111827;
  color: white;
  padding: 14px 18px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
}

/* Calendar inside the card */
.calendar-container {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 10;
}

.calendar-btn {
  background: #22c55e;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
}

.calendar-btn:hover {
  background: #16a34a;
}

.calendar-popup {
  margin-top: 6px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* ---------- Todo List Container ---------- */
.todo-list-container {
  max-height: 300px;        /* fixed height for scrolling */
  overflow-y: auto;         /* enable vertical scroll */
  margin-top: 12px;         /* spacing from input group */
  padding: 0 8px;           /* inner spacing */
  box-sizing: border-box;   /* include padding in height */
}

/* ---------- List Reset ---------- */
.todo-list-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ---------- Todo Items ---------- */
.todo-list-container li.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  margin-bottom: 10px;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

/* ---------- Modern Scrollbar ---------- */
.todo-list-container::-webkit-scrollbar {
  width: 8px;
}

.todo-list-container::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.15);
  border-radius: 4px;
}

.todo-list-container::-webkit-scrollbar-track {
  background: transparent;
}

/* Optional: hover effect for scrollbar */
.todo-list-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0,0,0,0.25);
}

</style>