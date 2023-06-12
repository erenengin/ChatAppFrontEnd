<template>
    <div class="register-container">
      <h1>Register Page</h1>
      <form>
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model="password" id="password" class="form-control" placeholder="Enter Password">
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input type="password" v-model="confirmPassword" id="confirm-password" class="form-control" placeholder="Confirm Password">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" class="form-control" placeholder="Enter Email">
        </div>
        <button type="button" class="btn btn-primary" @click="register">Register</button>
      </form>
      <div v-if="registerSuccess">Registration successful!</div>
      <div v-if="registerError">{{ registerErrorMessage }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        registerSuccess: false,
        registerError: false,
        registerErrorMessage: '',
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          this.registerErrorMessage = 'Passwords do not match';
          this.registerSuccess = false;
          this.registerError = true;
          return;
        }
  
        try {
          const payload = {
            id: 0,
            userName: this.username,
            password: this.password,
            email: this.email,
            role: 'user',
            isActive: true,
            lastActivity: new Date().toISOString()
          };
  
          const response = await fetch('https://chatwebapi.azurewebsites.net/api/User', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if (result.message.includes('Success')) {
            // Handle successful registration, such as displaying a success message or redirecting to the login page
            this.registerSuccess = true;
            this.registerError = false;
          } else {
            // Handle failed registration, such as displaying an error message
            this.registerErrorMessage = result.message;
            this.registerSuccess = false;
            this.registerError = true;
          }
        } catch (error) {
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style>
  .register-container {
    margin: 0 auto;
    padding: 2rem;
    max-width: 25rem;
  }
  
  .register-container h1 {
    text-align: center;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  .form-group label {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  
  .form-control {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #ced4da;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
  }
  </style>