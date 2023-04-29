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
    people: null,
    response: null,
    messages: null,
    videos: [
      {
        "id": "1",
        "user": "max234",
        "title": "Morskie Oko",
        "video": "media/test1.m4v",
        "enterprise": "0",
        "latitude_deg": "49.197293660153505",
        "longitude_deg": "20.070114291330302",
        "city": "Polska"

      },
      {
        "id": "2",
        "user": "hellboy111",
        "title": "Półwysep Helski",
        "video": "media/PHelski.m4v",
        "enterprise": "1",
        "latitude_deg": "54.72020702545742",
        "longitude_deg": "18.62371362580149",
        "city": "Polska"
      },
      {
        "id": "3",
        "user": "zoo23lublin",
        "title": "Zoo Park Lublin Wystawa Zwierząt",
        "video": "media/Zoo.m4v",
        "enterprise": "0",
        "latitude_deg": "51.235101541211954",
        "longitude_deg": "22.565035505161458",
        "city": "Lublin"
      },
      {
        "id": "4",
        "user": "spiz888",
        "title": "Spiżowi Mocni - Katowice Nocą",
        "video": "media/SpizowiMocni.m4v",
        "enterprise": "1",
        "latitude_deg": "50.26229259830117",
        "longitude_deg": "19.0113081473124",
        "city": "Katowice"
      },
      {
        "id": "5",
        "user": "energy2000",
        "title": "Atb - Energy 2000 Przytkowice Evolution [14.05.22]",
        "video": "media/Atb-Energy2000PrzytkowiceEvolution[14.05.22].m4v",
        "enterprise": "1",
        "latitude_deg": "49.90302879357454",
        "longitude_deg": "19.69306618686104",
        "city": "Przytkowice"
      },
      {
        "id": "6",
        "user": "mrkryha",
        "title": "JEDYNY W POLSCE KEBAB Z PLACKIEM ZIEMNIACZANYM BIG DADDY GRUDZIĄDZ - SPRAWDZAM JAK SMAKUJE",
        "video": "media/2022-05-23_@mrkryha_7100944888988060933.mp4",
        "enterprise": "1",
        "latitude_deg": "53.4931866843339",
        "longitude_deg": "18.75109805298859",
        "city": "Grudziądz"
      }
    ],

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
        let response = await axios.post('http://192.168.0.182:8000/api/users/accounts/login', qs.stringify(payload))
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
        let response = await axios.post('http://192.168.0.182:8000/api/users/accounts/register', qs.stringify(payload))
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
        let {data} = await axios.post('http://192.168.0.182:8000/api/users/accounts/friend/', payload)
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
        let {data} = await axios.get('http://192.168.0.182:8000/api/users/accounts/friend/' + state.userId + '/');
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
        await axios.delete('http://192.168.0.182:8000/api/users/accounts/friend/', { data: payload });
      } catch(e) {
        console.log(e)
      }
    },
    async getPeople({commit, state}) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await axios.get('http://192.168.0.182:8000/api/users/accounts/person/');
        commit('setPeople', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async getInBoxMessages({commit, state}, payload) {
      if (state.userId == null) {
        return;
      }
      try {
        let {data} = await axios.get('http://192.168.0.182:8000/api/users/messages/inbox/', {params: payload});
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
        let {data} = await axios.get('http://192.168.0.182:8000/api/users/messages/', {params: payload});
        console.log(data)
        commit('setMessages', Object.values(data))
      } catch(e) {
        console.log(e)
      }
    },
    async sendMessages({commit}, payload) {
      try {
        let {data} = await axios.post('http://192.168.0.182:8000/api/users/messages/', payload)
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
        let {data} = await axios.post('http://192.168.0.182:8000/api/users/video/add/', payload)
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
        let {data} = await axios.get('http://192.168.0.182:8000/api/users/video/add/')
        console.log(data);
        commit('addVideos', data)
        //console.log(state.userId);
      } catch (e) {
        console.log(e)
      }
    },
  }
})
