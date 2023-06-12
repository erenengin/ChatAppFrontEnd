import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import MainPage from '../components/MainPage.vue';
import ChatPage from '../components/ChatPage.vue';
import RegisterPage from '../components/RegisterPage.vue';
import ProfilePage from '../components/ProfilePage.vue';
import AdminPanel from '../components/AdminPanel.vue';
import AdminProfileDetail from '../components/AdminProfileDetail.vue';

const routes = [
  
  {
    path: '/',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      requiresAuth: false,
      
    }
  },
  {
    path: '/RegisterPage',
    name: 'RegisterPage',
    component: RegisterPage,
    meta: {
      requiresAuth: false,
      
    }
  },
  {
    path: '/mainpage',
    name: 'MainPage',
    component: MainPage,
    meta: {
      requiresAuth: true, // Sadece giriş yapmış kullanıcılar için erişilebilir
    },
  },
  {
    path: '/chatpage/:username',
    name: 'ChatPage',
    component: ChatPage,
    meta: {
      requiresAuth: true, // Sadece giriş yapmış kullanıcılar için erişilebilir
    },
  },
  {
    path: '/ProfilePage/:username',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: {
      requiresAuth: true, // Sadece giriş yapmış kullanıcılar için erişilebilir
    },
  },  
  {
    path: '/AdminPanel',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: {
      requiresAuth: true, // Sadece giriş yapmış kullanıcılar için erişilebilir
      allowedRoles: ['admin']
    },
  },
  {
    path: '/AdminProfileDetail/:id',
    name: 'AdminProfileDetail',
    component: AdminProfileDetail,
    meta: {
      requiresAuth: true, // Sadece giriş yapmış kullanıcılar için erişilebilir
      allowedRoles: ['admin']
    },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
/*router.beforeEach((to, from, next) => {

  
  const token = localStorage.getItem('token');
      if(token)
        var decodedToken = jwtDecode(token);
       
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  // Kullanıcının rollerini al (localStorage'den veya API'den)
      
      var userRoles = [role];
      console.log(userRoles)
      var req = to.meta.roles;
      console.log(req)
  if (to.meta.allowedRoles && to.meta.allowedRoles.length > 0) {
    // Gerekli roller tanımlıysa
    if (userRoles && userRoles.some(role => to.meta.allowedRoles.includes(role))) {
      // Kullanıcının en az bir gerekli role sahip olduğunu kontrol et
      
      next(); // Geçişe izin ver
    } else if(to.meta.requiresAuth === true) {
      // Kullanıcı gerekli rollerden birine sahip değil, izin verme
      next('/mainpage'); // Örneğin, yetkisiz erişim sayfasına yönlendir
    }
  } else  {
    // Gerekli roller tanımlı değilse, izin ver

    next();
  }
});*/








export default router;
