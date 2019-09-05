import Vuex         from 'vuex'
import {
  getField,
  updateField }     from 'vuex-map-fields'

export const strict = false;

export const defaultState = () => ({
  locationResDataNew: {},
})

const state = () => defaultState();

export const mutations = {
  updateField,
  RESET_BASE_STATE(state) {
    Object.assign(state, defaultState())
  },
  SET_LOCATION_RESPONSE_DATA(state, payload) {
    state.locationResDataNew = payload;
  },
}

export const actions = {
  resetBaseState({ commit }) {
    commit('RESET_BASE_STATE')
  },
  setLocationData(context, payload) {
    context.commit("SET_LOCATION_RESPONSE_DATA", payload)
  },
  /**
   * Note: we can only use this via SSR
   */
  async nuxtServerInit({ commit, state }, { redirect, req }) {}
}

export const getters = {
  getField
}

export default {
  namespaced:       true,
  modules: {},
  mutations,
  actions,
  getters,
  state,
};