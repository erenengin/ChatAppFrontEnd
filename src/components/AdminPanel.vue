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
  
      <div class="box-container">
      <div class="box">
        <div class="user-header">
          <div class="user-name-header">KULLANICI LİSTESİ</div>
          
        </div>
        <div v-for="(user, index) in users" :key="index" class="user" @click="selectUser(user)">
          <div class="user-name">{{ user.userName }}</div>
          <div class="user-email">{{ user.email }}</div>
    </div>
      </div>
      
    
    </div>
  
        
    <div class="chat-container">
      <div class="selected-user">Users Requests</div>
      <div class="messages-container" ref="messagesContainer">
  <ul>
    <div v-for="(message, index) in messagesDb" :key="index" class="message">

    <div class="request-message-text">{{ message }}</div>

</div>
  </ul>
</div>

    </div>
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
          users: [],
          messagesDb: [],
          id: ''
        };
      },
      mounted() {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          this.username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
          this.loadUsers();
          this.loadDbMessages();
           if (this.role === 'admin') {
        this.isAdmin = true;
      }else this.isAdmin = false;
        }
      },
      methods: {
          async loadUsers() {
    try {
      const response = await fetch('https://chatwebapi.azurewebsites.net/api/Login', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      this.users = data;
    } catch (error) {
      console.log(error);
    }
  }, selectUser(user) {
    
    this.selectedUser = user;
    console.log(user)
    console.log(user.userName)
    console.log(user.id)
    
    this.$router.push({ name: 'AdminProfileDetail', params: { id: user.id }});
    //this.loadMessages();
  },
  async scrollToBottom() {
  const container = this.$refs.messagesContainer;
  console.log("scroll func")
  container.scrollTop = container.scrollHeight;
},
  async loadDbMessages() {


 
const response = await fetch(`https://chatwebapi.azurewebsites.net/api/Chat?groupId=1-1`, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
Authorization: `Bearer ${localStorage.getItem('token')}`
}
});


const data = await response.json();

console.log(data)

console.log(data.message);
data.forEach(item => {
this.messagesDb.push(item.message)

});
await this.$nextTick();
await this.scrollToBottom();
//console.log(messages)
//this.messages = [...this.messages, ...messages];
//this.messageUsers = [...this.messageUsers, ...this.messageUser];
console.log(this.messageUsersDb)

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