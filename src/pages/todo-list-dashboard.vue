<template>
  <div class="app-container">
    <div v-if="showNotification" class="toast">
      {{ notification }}
    </div>

    <div class="todo-card">
     
      <h1>Advanced Todo Application</h1>

      <label>Add new task</label>
      <input v-model="newTodo" placeholder="Add a new todo" />

      <button class="add-btn" @click="addTask">Add task</button>

      <ul>
        <li v-for="(todo, index) in todos" :key="index">
          <span>{{ todo }}</span>
          <button class="remove-btn" @click="removeTask(index)">Remove</button>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';

const newTodo = ref('');
const todos = ref([]);
const notification = ref('');
const showNotification = ref(false);

//function to add a new task
function addTask() {
  if (newTodo.value.trim() !== '') {
    todos.value.push(newTodo.value.trim());
    newTodo.value = '';
    console.log('Current Todos:', todos.value);
  }
}
//function to remove a task
function removeTask(index) {
  const removeTodo = todos.value[index];
  if (!removeTodo) return;
  
    todos.value.splice(index, 1);
    
    notification.value = `"${removeTodo}" was removed`;
    showNotification.value = true;

    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  }
</script>
<style scoped>
/* Center everything */
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f4f6f8;
  font-family: Arial, sans-serif;
}

/* Card */
.todo-card {
  background: white;
  padding: 24px;
  width: 350px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Title */
.todo-card h1 {
  text-align: center;
  margin-bottom: 20px;
}

/* Input */
.todo-card input {
  width: 100%;
  padding: 8px;
  margin: 8px 0 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Buttons */
.add-btn {
  width: 50%;
  padding: 8px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background: #43a047;
}

/* Todo list */
ul {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 10px;
  margin-bottom: 8px;
  border-left: 4px solid #4caf50;
  /* simulates notebook spine */
  border-bottom: 1px dashed #bbb;
  /* horizontal notebook line */
  background: #fffbea;
  /* light paper color */
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: 'Georgia', serif;
  font-size: medium;
  /* gives handwritten notebook feel */
}


/* Remove button */
.remove-btn {
  background: #e53935;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn:hover {
  background: #d32f2f;
}

.toast {
  position: fixed;
  top: 50px;
  right: 440px;
  background: #323232;
  color: white;
  padding: 12px 16px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 2s ease;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  10% {
    opacity: 1;
    transform: translateY(0);
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
