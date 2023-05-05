import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import router from "@/router";
import qs from "qs";

Vue.use(Vuex)

const API_URL = "http://192.168.0.182:8000/api/";

export default new Vuex.Store({
  state: {
    token: null,
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
      state.token = null;
      state.userId = null;
      state.friends = null;
      state.people = null;
      state.messages = null;
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
        let response = await axios.post(`${API_URL}users/accounts/login`, qs.stringify(payload))
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
        let response = await axios.post(`${API_URL}users/accounts/register`, qs.stringify(payload))
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
        let {data} = await axios.post(`${API_URL}users/accounts/friend/`, payload)
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
        let {data} = await axios.get(`${API_URL}users/accounts/friend/` + state.userId + '/');
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
        await axios.delete(`${API_URL}users/accounts/friend/`, { data: payload });
      } catch(e) {
        console.log(e)
      }
    },
    async getPeople({commit, state}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await axios.get(`${API_URL}users/accounts/person/`);
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
        let {data} = await axios.get(`${API_URL}users/accounts/person/` + payload.id + '/');
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
        let {data} = await axios.get(`${API_URL}users/messages/inbox/`, {params: payload});
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
        let {data} = await axios.get(`${API_URL}users/messages/`, {params: payload});
        console.log(data)
        commit('setMessages', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async sendMessages({commit}, payload) {
      try {
        let {data} = await axios.post(`${API_URL}users/messages/`, payload)
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
        let {data} = await axios.post(`${API_URL}users/video/add/`, payload)
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
        let {data} = await axios.get(`${API_URL}users/video/add/`, {params: {user_id: state.userId}})
        console.log(data);
        commit('addVideos', data)
        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
    async sendLikeVideo({state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await axios.post(`${API_URL}users/video/like/`, payload)
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
        let {data} = await axios.delete(`${API_URL}users/video/like/`, {data: payload})
        console.log(data);

        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
  }
})
