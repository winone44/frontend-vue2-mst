import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";
import qs from "qs";
import axios from "axios";

Vue.use(Vuex)

const API_URL = "http://192.168.0.182:8000/api/";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

async function onRequestFailure(error, store) {
  const { config } = error;
  if (error.response.status === 401 && config && !config.__isRetryRequest) {
    // Jeśli odpowiedź to 401 Unauthorized, spróbuj odświeżyć tokeny
    try {
      await store.dispatch('refreshTokens');
      // Jeśli odświeżanie się powiedzie, spróbuj ponownie wykonać żądanie z nowym tokenem
      config.__isRetryRequest = true;
      // Aktualizuj token w konfiguracji żądania
      config.headers['Authorization'] = `Bearer ${store.state.accessToken}`;
      const response = apiClient(config);
      console.log(response);
      return response;
    } catch (refreshError) {
      // Jeśli odświeżanie się nie powiedzie, wyloguj użytkownika
      store.dispatch('logout');
      // Przekieruj do strony logowania lub innego komponentu
      router.push({ name: 'login' });
    }
  }
  return Promise.reject(error);
}


const store = new Vuex.Store({
  state: {
    accessToken: null,
    refreshToken: null,
    userId: null,
    friends: null,
    person: null,
    people: null,
    response: null,
    messages: null,
    videos: null,

  },
  getters: {
    isAuth: state => {
      return state.accessToken !== null && state.accessToken !== undefined
    }
  },
  mutations: {
    auth(state, payload) {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.userId = payload.userId;

      console.log('accessToken')
      console.log(payload.accessToken)
      console.log('refreshToken')
      console.log(payload.refreshToken)
      if (payload.accessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`;
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    },
    updateTokens(state, payload) {
      state.accessToken = payload.accessToken;

      console.log('accessToken')
      console.log(payload.accessToken)
      if (payload.accessToken) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${payload.accessToken}`;
      } else {
        delete apiClient.defaults.headers.common['Authorization'];
      }
    },
    setFriends(state, payload) {
      state.friends = payload;
    },
    setPerson(state, payload) {
      state.person = payload;
    },
    setPeople(state, payload) {
      state.people = payload;
    },
    setMessages(state, payload) {
      state.messages = payload;
    },
    addMessages(state, payload) {
      state.messages.splice(0,0,payload);
    },
    addVideos(state, payload) {
      state.videos = payload;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.friends = null;
      state.person = null;
      state.people = null;
      state.messages = null;
      state.videos = null;
      delete apiClient.defaults.headers.common['Authorization'];
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
        let response = await apiClient.post(`${API_URL}users/accounts/login`, qs.stringify(payload))
        console.log(response);
        console.log(response.data.localId);
        commit('auth', {
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
          userId: response.data.localId
        });



        const now = new Date();
        const endDate = new Date(now.getTime() + response.data.refresh_token_lifetime * 1000)
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('userId', response.data.localId);
        localStorage.setItem('expires', endDate);

        console.log(response.data.refresh_token_lifetime)

        setTimeout(() => {
          dispatch('logout');
        }, response.data.refresh_token_lifetime * 1000)

      } catch (e) {
        commit('setResponse', {
          response: e
        });
        console.log(e)
      }
    },
    async refreshTokens({ state, commit }) {
      try {
        let response = await apiClient.post(`${API_URL}users/accounts/token-refresh/`, {
          refresh: state.refreshToken,
        });
        commit('updateTokens', {
          accessToken: response.data.access,
        });
        console.log('refreshTokens Action')
        console.log(response.data.access)
        localStorage.setItem('accessToken', response.data.access);
      } catch (error) {
        console.error(error);
      }


    },
    logout({commit}) {
      commit('clearAuth');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('expires');
      router.push('/');

    },
    autologin({commit, dispatch}) {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      if (!accessToken) {
        return;
      }
      const userId = localStorage.getItem('userId')
      if (!userId) {
        return;
      }
      const expirationDate = new Date(localStorage.getItem('expires'));
      const now = new Date();
      if (now >= expirationDate) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expires');
        return;
      }

      commit('auth', {
        accessToken,
        refreshToken,
        userId
      });
      console.log("Pozostało tyle sekund: ", expirationDate.getTime() - now.getTime())
      setTimeout(() => {
        dispatch('logout');
      },expirationDate.getTime() - now.getTime())
    },
    async register({commit}, payload) {
      try {
        let response = await apiClient.post(`${API_URL}users/accounts/register`, qs.stringify(payload))
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
    async addFriend({state}, payload) {
      try {
        let {data} = await apiClient.post(`${API_URL}users/accounts/friend/`, payload)
        console.log(data);
        console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async getFriends({commit, state}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/accounts/friend/` + state.userId + '/');
        console.log('zrobione')
        commit('setFriends', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async delFriend({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        await apiClient.delete(`${API_URL}users/accounts/friend/`, { data: payload });
      } catch(e) {
        console.log(e)
      }
    },
    async getPeople({commit, state}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/accounts/person/`);
        commit('setPeople', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async getPerson({commit, state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/accounts/person/` + payload.id + '/');
        console.log(data)
        commit('setPerson', data)
      } catch(e) {
        console.log(e)
      }
    },
    async getInBoxMessages({commit, state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/messages/inbox/`, {params: payload});
        console.log(data)
        commit('setMessages', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async getMessages({commit, state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/messages/`, {params: payload});
        console.log(data)
        commit('setMessages', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async sendMessages({commit}, payload) {
      try {
        let {data} = await apiClient.post(`${API_URL}users/messages/`, payload)
        console.log(data);
        commit('addMessages', data)
        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async sendVideoForm({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.post(`${API_URL}users/video/add/`, payload)
        console.log(data);

        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async getVideos({state, commit}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/videos/get/`, {params: {user_id: state.userId}})
        console.log(data);
        commit('addVideos', data)
        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async getUserVideos({state, commit}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.get(`${API_URL}users/videos/person/get/`, {params: payload})
        console.log(data);
        commit('addVideos', data)
        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async delUserVideos({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.delete(`${API_URL}users/videos/person/del/`, {data: payload})
        console.log(data);
      } catch (e) {
        console.log(e)
      }
    },
    async sendLikeVideo({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.post(`${API_URL}users/video/like/`, payload)
        console.log(data);

        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async delLikeVideo({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await apiClient.delete(`${API_URL}users/video/like/`, {data: payload})
        console.log(data);

        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
  }
})


apiClient.interceptors.response.use(
    (response) => response,
    (error) => onRequestFailure(error, store)
);

export default store;