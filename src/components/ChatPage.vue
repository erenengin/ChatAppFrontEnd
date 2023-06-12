<template>
  <div class="chat-page">
    <div class="navbar">
      <div class="navbar-left" @click="$router.push('/mainpage')">ChatForMuhtas</div>
      <div class="navbar-right">{{ username }} ({{ role }})</div>
    </div>
    <div class="chat-container">
      <div class="selected-user">{{ selectedUser }}</div>
      <div class="messages-container" ref="messagesContainer">
  <ul>
    <div v-for="(message, index) in messagesDb" :key="index" class="message">
  <div class="message-content" :class="{'own-message': messageUsersDb[index] === this.username}">
    <div class="message-text" :class="{'own-messagebg': messageUsersDb[index] === this.username, 'recieved-messagebg': messageUsersDb[index] !== this.username}">{{ message }}</div>
  </div>
</div>

    <div v-for="(message, index) in messages" :key="index" class="message">
  <div class="message-content" :class="{'own-message': messageUsers[index] === this.username}">
    <div class="message-text" :class="{'own-messagebg': messageUsers[index] === this.username, 'recieved-messagebg': messageUsers[index] !== this.username}">{{ message }}</div>
   
  </div>
</div>
  </ul>
</div>
<div class="message-input-container">
  <input type="text" v-model="newMessage" class="message-input" placeholder="Mesajınızı girin..." @keyup.enter="sendMessage">
  <button @click="newMessage && sendMessage()" class="send-button">Gönder</button>
</div>
    </div>
  </div>
</template>

<script>
import * as signalR from "@microsoft/signalr";
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      username: '',
      role: '',
      selectedUser: '',
      messageUser: '',
      messageUsers: [],
      messages: [],
      messageUsersDb: [],
      messagesDb: [],
      newMessage: ''
    };
  },
  created() {
    const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        this.username = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        this.role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        this.userid = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
       
      }
    this.selectedUser = this.$route.params.username;
    this.selectedUserId = this.$route.query.id;

  },
  mounted() {
    // Sayfa yüklendiğinde SignalR bağlantısı yap
    this.startSignalRConnection();
    this.loadDbMessages();
    this.scrollToBottom();
  },
  methods: {
    setGroupId(userid,selectedUserId){
  if (userid < selectedUserId) {
  return userid.toString() + "-" + selectedUserId.toString();
} else {
  return selectedUserId.toString() + "-" + userid.toString();
}

},
    async loadDbMessages() {

      const userid = this.userid
      const selectedUserId = this.selectedUserId
      const groupId = this.setGroupId(userid, selectedUserId);  
 const response = await fetch(`https://chatwebapi.azurewebsites.net/api/Chat?groupId=${groupId}`, {
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
  if (item.senderId === parseInt(this.userid)) {
    this.messageUsersDb.push(this.username);
    console.log(this.messageUsersDb)
  } else {
    this.messageUsersDb.push(this.selectedUser);
    console.log(this.userid)
    console.log(item.senderId)
  }
});
await this.$nextTick();
await this.scrollToBottom();
//console.log(messages)
//this.messages = [...this.messages, ...messages];
//this.messageUsers = [...this.messageUsers, ...this.messageUser];
console.log(this.messageUsersDb)

},

    startSignalRConnection() {
  //const hubUrl = 'https://localhost:7200/chatHub'; // Hub URL'si, projenize göre güncelleyin
  const hubUrl = 'https://chatwebapi.azurewebsites.net/chatHub';
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .build();

  connection.on('ReceiveMessage', (user, message) => {
    // Yeni mesajı al ve listeye ekle
    console.log("abc")
    this.messageUsers = [...this.messageUsers, user];
    this.messages = [...this.messages, message];
    this.scrollToBottom();
  });

  connection.start()
    .then(() => {
      const userid = this.userid
      const selectedUserId = this.selectedUserId
      console.log('SignalR bağlantısı başarıyla kuruldu.');
      // Kullanıcıyı grup kaydına ekleme
      const groupId = this.setGroupId(userid, selectedUserId); // Grup ID'si, projenize göre güncelleyin
      console.log(groupId);
      connection.invoke('JoinGroup', groupId)
        .then(() => {
          console.log('Gruba katılım başarılı.');
        })
        .catch((error) => {
          console.error('Gruba katılma hatası:', error);
        });
    })
    .catch((error) => {
      console.error('SignalR bağlantısı hatası:', error);
    });
},
async scrollToBottom() {
  const container = this.$refs.messagesContainer;
  console.log("scroll func")
  container.scrollTop = container.scrollHeight;
},
sendMessage() {
  const message = {
    userName: this.username,
    text: this.newMessage
  };
        const userid = this.userid
      const selectedUserId = this.selectedUserId
  const groupId = this.setGroupId(userid, selectedUserId);  
  const recMessage = {
    SenderId: this.userid,
    MessageDate: null,
    Message: this.newMessage,
    GroupId: groupId
  };
  if (message.text === '') {
    return true;
  }

  const hubUrl = 'https://chatwebapi.azurewebsites.net/ChatHub'; // Hub URL'si, projenize göre güncelleyin
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .build();

  connection.start()
    .then(() => {
      const userid = this.userid
      const selectedUserId = this.selectedUserId
      // Kullanıcıyı grup kaydına ekleme
      const groupId = this.setGroupId(userid, selectedUserId); // Grup ID'si, projenize göre güncelleyin
      console.log(groupId);
      connection.invoke('JoinGroup', groupId)
        .then(() => {
          // Mesajı gönderme
          connection.invoke('SendMessage', message.userName, message.text, groupId)
            .then(() => {
              console.log('Mesaj gönderildi:', message);
              fetch('https://chatwebapi.azurewebsites.net/api/Chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(recMessage)
  })
  this.scrollToBottom();
              this.newMessage = ''; // Mesaj girişini temizle
            })
            .catch((error) => {
              console.error('Mesaj gönderme hatası:', error);
            });
        })
        .catch((error) => {
          console.error('Gruba katılma hatası:', error);
        });
    })
    .catch((error) => {
      console.error('SignalR bağlantısı hatası:', error);
    });
}


  
}
}
</script>

<style>
body {
  background-color: #b24040; /* Arka plan rengi */
  /* veya */

  /* Ekstra stil ayarları */

  background-size: cover;
}
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100%;

}

.navbar {
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
}

.own-message {
  justify-content: flex-end;
}
.navbar-left {
  font-size: 20px;
  cursor: pointer;
}
.selected-user{

 text-align: left;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh; /* Yükseklik ayarı */
  width: 50%; /* Genişlik ayarı */
  margin: 50px auto; /* Kenarlarda boşluk ve yatayda ortalamak için */
  border: 2px solid #000; /* Siyah çizgi çerçeve */
  padding: 20px; /* İçeriği çevreleyen boşluk */
  background-color: #f2f2f2;
  border-radius: 10px;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #635d5d;
  border-radius: 10px;
}

.message {
  font-weight: bold;
}

.message-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  
}

.message-username {
  margin-right: 10px;
  font-weight: bold;
}

.message-text {
  
  font-weight: bold;
  display: inline-block;
  padding: 10px;
  border-radius: 5px;
 
  margin-bottom: 10px;
}
.own-messagebg{
  background-color: greenyellow;
}
.recieved-messagebg{
  background-color: aqua;
}
.message-username:after {
  content: attr(data-username) ": ";
}

.message-input-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.message-input {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
}

.send-button {
  padding: 5px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 10px;
}
</style>