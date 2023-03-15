import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import router from "@/router";
import qs from "qs";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    userId: null,
    friends: null,
    response: null,

  },
  getters: {
    isAuth: state => {
      return state.token !== null && state.token !== undefined
    }
  },
  mutations: {
    auth(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
    },
    setFriends(state, payload) {
      state.friends = payload;
    },
    clearAuth(state) {
      state.token = null;
      state.userId = null;
      state.friends = null;
    },
    setResponse(state, payload) {
      state.response = payload.response;
      setTimeout(() => {
        state.response = null
      }, 3000)
    }
  },
  actions: {
    async login({commit, dispatch}, payload) {
      try {
        console.log(payload);
        let response = await axios.post('http://localhost:8000/api/users/accounts/login', qs.stringify(payload))
        console.log(response);
        console.log(response.data.localId);
        commit('auth', {
          token: response.data.access,
          userId: response.data.localId
        });

        const now = new Date();
        const endDate = new Date(now.getTime() + response.data.expiresIn * 1000)
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('userId', response.data.localId);
        localStorage.setItem('expires', endDate);

        setTimeout(() => {
          dispatch('logout');
        }, response.data.expiresIn * 1000)

      } catch (e) {
        commit('setResponse', {
          response: e
        });
        console.log(e)
      }
    },
    logout({commit}) {
      commit('clearAuth');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('expires');
      router.push('/');

    },
    autologin({commit, dispatch}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return;
      }
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return;
      }
      const expirationDate = new Date(localStorage.getItem('expires'));
      const now = new Date();
      if (now >= expirationDate) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('expires');
        return;
      }

      commit('auth', {
        token,
        userId
      });
      console.log("Pozostało tyle sekund: ", expirationDate.getTime() - now.getTime())
      setTimeout(() => {
        dispatch('logout');
      },expirationDate.getTime() - now.getTime())
    },
    async register({commit}, payload) {
      try {
        let response = await axios.post('http://localhost:8000/api/users/accounts/register', qs.stringify(payload))
        console.log(response);
        router.push({name: 'login'})

      } catch (e) {
        commit('setResponse', {
          // response: e.response.data.error.message
          response: e
        });
        console.log(e)
      }


    },
    async getFriends({commit, state}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await axios.get('http://localhost:8000/api/users/accounts/friend/2/');
        commit('setFriends', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    }
  }
})
