import {
  getField,
  updateField }     from 'vuex-map-fields';

export const sanitationState = () => JSON.parse(process.env.sanitation);

const state = () => sanitationState();

const getters = {
  getField
}

const mutations = {
  updateField,
  RESET_SANITATION_STATE(state) {
    Object.assign(state, sanitationState())
  },
}

const actions = {
  sanitationState({ commit }) {
    commit('RESET_SANITATION_STATE')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};