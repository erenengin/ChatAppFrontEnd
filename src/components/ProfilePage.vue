<template>
        <div class="navbar">
     
     <div class="navbar-left">
       <div class="chat-title" @click="$router.push('/mainpage')">ChatForMuhtas</div>
 <div v-if="isAdmin" class="admin-panel-link">
   <router-link to="/adminpanel" class="admin-link">Admin Panel</router-link>
 </div>
</div>


     <div class="navbar-right">
       <div class="chat-title-nobutton">{{ username }} ({{ role }})</div><div class="exit-title" @click="$router.push('/')">Çıkış Yap</div></div>
     
     
   </div>
    <div class="register-container">
      <h1>Your Personal Data</h1>
      <p class="input-info">You can not change your name without request. If you make a change, your request will be sent to an Admin </p>
      <form>
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="username" id="username" class="form-control" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" v-model= "passwordcheck" id="password" class="form-control" placeholder="Enter Password">
        </div>
        <div class="form-group">
          <label for="new-password">New Password:</label>
          <input type="password" v-model="newPassword" id="new-password" class="form-control" placeholder="Confirm Password">
        </div>
        <div class="form-group">
        <label for="confirm-password">New Password Again:</label>
          <input type="password" v-model="confirmPassword" id="confirm-password" class="form-control" placeholder="Confirm Password">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="email" id="email" class="form-control" placeholder="Enter Email" :disabled=true>
        </div>
        <button type="button" class="btn btn-primary" @click="updateData">Update Credentials</button>
      </form>
      <div v-if="loginSuccess">Update was succesful</div>
      <div v-if="loginError">Unexpected error</div>
    </div>
  </template>
  <script>
  import jwtDecode from 'jwt-decode';
  
  export default {
    data() {
      return {
        username: '',
        role: '',
        email: '',
        password: '',
        oldUsername: '',
        newPassword: '',
        passwordcheck: '',
        confirmPassword: '',
        isAdmin: '',
        loginSuccess: false,
        loginError: false,
      };
    },created() {
        const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        this.username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.userid = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
       
      }
      this.oldUsername = this.username;
      if (this.role === 'admin') {
      this.isAdmin = true;
    }else this.isAdmin = false;
      
      

    },
    mounted() {
 this.loadData();
    }, methods: {

        async loadData() {
  try {
    const response = await fetch(`https://chatwebapi.azurewebsites.net/api/Login/${this.userid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
    const data = await response.json();
    var userinfo = data;
    this.password = userinfo.password;
    this.email = userinfo.email;
    console.log(userinfo)
  } catch (error) {
    console.log(error);
  }
},      async updateData() {
        if (this.newPassword !== this.confirmPassword && this.password === this.passwordcheck) {
         console.log("Password do not match!!")
          return;
        }
        if(this.newPassword === '')
        this.newPassword = this.password;
        if(this.username !== this.oldUsername && this.isAdmin !== true){
            const recMessage = {
    SenderId: 1,
    MessageDate: null,
    Message: `User ${this.oldUsername} wants to change their name to ${this.username}`,
    GroupId: '1-1'
  };
            fetch('https://chatwebapi.azurewebsites.net/api/Chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(recMessage)
  })

        }
        try {
          const payload = {
            id: this.userid,
            userName: this.oldUsername,
            password: this.newPassword,
            email: this.email,
            role: this.role,
            isActive: true,
            lastActivity: new Date().toISOString()
          };
          if(this.isAdmin === true)
          {
            payload.userName = this.username;
          }
  
          const response = await fetch('https://chatwebapi.azurewebsites.net/api/User', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          this.passwordcheck = '';
    this.newPassword = '';
    this.confirmPassword = '';
          const result = await response.json();
          this.loginSuccess = true;
          console.log(result);
        } catch (error) {
            this.loginError = true;
          console.error('error');
        }


    }

    }
  }
  </script>

<style>
    .login-container {
        margin: 0 auto;
        padding: 2rem;
        max-width: 25rem;
    }

    .login-container h1 {
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
    .chat-title-nobutton {
  margin-right: 10px;
  
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
