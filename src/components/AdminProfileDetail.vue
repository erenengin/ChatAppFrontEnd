<template>
    <div class="main-container">
      <div class="navbar">
        <div class="navbar-left">
          <div class="chat-title" @click="$router.push('/mainpage')">ChatForMuhtas</div>
          <div v-if="isAdmin" class="admin-panel-link">
            <router-link to="/adminpanel" class="admin-link">Admin Panel</router-link>
          </div>
        </div>
  
        <div class="navbar-right">
          <div class="chat-title" @click="$router.push({ name: 'ProfilePage', params: { username: username } })">
            {{ username }} ({{ role }})
          </div>
          <div class="exit-title" @click="$router.push('/')">Çıkış Yap</div>
        </div>
      </div>
      <form>
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" v-model="selectedUser" id="username" class="form-control" placeholder="Enter username">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="text" v-model="userPassword" id="password" class="form-control" placeholder="Enter Password">
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input type="text" v-model="confirmPassword" id="confirm-password" class="form-control" placeholder="Confirm Password">
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" v-model="selectedEmail" id="email" class="form-control" placeholder="Enter Email">
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
          selectedEmail: '',
          selectedUser: '',
          userPassword:'',
          userid:'',
          passwordcheck: '',
          confirmPassword:''
        };
      },
      mounted() {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          this.username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          this.userid = this.$route.params.id;
          this.loadData();
            this.passwordcheck = this.userPassword;
           if (this.role === 'admin') {
        this.isAdmin = true;
      }else this.isAdmin = false;
        }
      },
      methods: {
        async loadData() {
  try {
    const response = await fetch(`https://chatwebapi.azurewebsites.net/api/Login/${this.userid}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
    const data = await response.json();
    var userinfo = data;
    console.log(userinfo)
    this.selectedUser = userinfo.userName;
    this.userPassword = userinfo.password;
    this.selectedEmail = userinfo.email;
    console.log(this.selectedEmail)
  } catch (error) {
    console.log(error);
  }
},async updateData() {
        if (this.userPassword !== this.confirmPassword || this.userPassword === this.passwordcheck) {
         console.log("Password do not match!!")
          return;
        }
        if(this.userPassword === '')
        this.userPassword = this.passwordcheck;

        try {
          const payload = {
            id: this.userid,
            userName: this.selectedUser,
            password: this.userPassword,
            email: this.selectedEmail,
            role: 'user',
            isActive: true,
            lastActivity: new Date().toISOString()
          };
     
          const response = await fetch('https://chatwebapi.azurewebsites.net/api/User', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          this.passwordcheck = '';
    this.userPassword = '';
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
    };
    </script>
  
  <style>
  .admin-box {
  background-color: rgb(141, 141, 132);
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  height: 100px; /* İstenilen yükseklik değeri */
  overflow-y: auto; /* Dikey kaydırma çubuğu görüntülemek için */
}
.request-message-text {
  
  font-weight: bold;
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
 
  margin-bottom: 10px;
  background-color: aqua;
}
  .main-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .admin-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #635d5d;
  border-radius: 10px;
  width: 30%;
  float: right;
}
  
  .navbar {
    background-color: #000;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    position: fixed;
    top: 0;
    width: 95%;
    z-index: 1;
  }
  
  
  .navbar-right {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .navbar-right span {
    flex-shrink: 0;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .navbar-left {
    display: flex;
    align-items: center;
  
  }
  
  .chat-title {
    margin-right: 10px;
    cursor: pointer;
  }
  .chat-title-nobutton {
    margin-right: 10px;
    
  }
  .exit-title {
    margin-right: 10px;
    cursor: pointer;
    color: red;
  }
  .admin-chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh; /* Yükseklik ayarı */
  width: 30%; /* Genişlik ayarı */
  margin: 50px auto; /* Kenarlarda boşluk ve yatayda ortalamak için */
  border: 2px solid #000; /* Siyah çizgi çerçeve */
  padding: 20px; /* İçeriği çevreleyen boşluk */
  background-color: #f2f2f2;
  border-radius: 10px;
  float: right;
}
  
  .admin-panel-link {
    display: flex;
    align-items: center;
  }
  
  .admin-link {
    margin-left: 10px;
    color: white;
    text-decoration: none;
  }
  
  .box-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
  }
  
  .box {
    background-color: rgb(141, 141, 132);
    padding: 20px;
    border-radius: 10px;
    height: 100px; /* İstenilen yükseklik değeri */
    overflow-y: auto; /* Dikey kaydırma çubuğu görüntülemek için */
  }
  
  .user {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #000;
    cursor: pointer;
  }
  
  .user-name {
    font-weight: bold;
  }
  
  .user-email {
    margin-left: 20px;
  }
  </style>