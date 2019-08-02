import {
  getField,
  updateField }     from 'vuex-map-fields';

export const locationsState = () => ({
  indianapolis: JSON.parse(process.env.indianapolis),
  monroeCounty: JSON.parse(process.env.monroeCounty),
  bloomington:  JSON.parse(process.env.bloomington)
})

const state = () => locationsState();

const getters = {
  getField
}

const mutations = {
  updateField,
  RESET_LOCATIONS_STATE(state) {
    Object.assign(state, locationsState())
  },
}

const actions = {
  locationsState({ commit }) {
    commit('RESET_LOCATIONS_STATE')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};