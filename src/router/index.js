import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/main/Home.vue'

import store from "@/store";

Vue.use(Router)


store.dispatch('autologin');

const authGuard = (to, from, next) => {
  if (store.getters.isAuth) {
    next();
  }else {
    next({name: 'login'})
  }
}

const notAuthGuard = (to, from, next) => {
  if (!store.getters.isAuth) {
    next();
  }else {
    next({name: 'protected-mail'})
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: notAuthGuard,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/main/Register.vue'),
      beforeEnter: notAuthGuard,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/main/Login.vue'),
      beforeEnter: notAuthGuard,
    },
    {
      path: '/protected-friends',
      name: 'protected-friends',
      component: () => import('@/views/main/ProtectedFriends.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/protected-tiktok/:userId?',
      name: 'protected-tiktok',
      component: () => import('@/views/AppTiktok.vue'),
      beforeEnter: authGuard,
      props: true
    },
    {
      path: '/protected-mail',
      name: 'protected-mail',
      component: () => import('@/views/main/ProtectedMail.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/protected-mail/conversations/:id',
      name: 'protected-mail-conversations',
      component: () => import('@/views/main/ProtectedMailConversation.vue'),
      beforeEnter: authGuard,
      props: true,
    },
    {
      path: '/protectedSearchFriend',
      name: 'protected-search-friend',
      component: () => import('@/views/main/ProtectedSearchFriend.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/add-new-video',
      name: 'add-new-video',
      component: () => import('@/views/main/AddTiktokForm.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/user/:id/',
      name: 'user',
      component: () => import('@/views/main/UserProfile.vue'),
      beforeEnter: authGuard,
      props: true
    },
  ]
})

if (store.getters.isAuth) {
  const expirationDate = new Date(localStorage.getItem('expires'));
  const now = new Date();

  if (expirationDate <= now) {
    store.dispatch('logout')
  } else {
    setTimeout(() => {
      store.dispatch('logout');
    }, expirationDate.getTime() - now.getTime());
  }
}
