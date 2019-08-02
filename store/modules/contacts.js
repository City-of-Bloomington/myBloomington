import {
  getField,
  updateField }     from 'vuex-map-fields';

export const contactsState = () => ({
  mayor:            {},
  clerk:            {},
  council:          {},
  district:         JSON.parse(process.env.districtReps)
})

const state = () => contactsState();

const getters = {
  getField
}

const mutations = {
  updateField,
  RESET_CONTACTS_STATE(state) {
    Object.assign(state, contactsState())
  },
  SET_MAYOR(state, payload) {
    state.mayor = payload
  },
  SET_CLERK(state, payload) {
    state.clerk = payload
  },
  SET_COUNCIL(state, payload) {
    state.council = payload
  }
}

const actions = {
  contactsState({ commit }) {
    commit('RESET_CONTACTS_STATE')
  },
  setMayor(context, payload) {
    context.commit('SET_MAYOR', payload)
  },
  setClerk(context, payload) {
    context.commit('SET_CLERK', payload)
  },
  setCouncil(context, payload) {
    context.commit('SET_COUNCIL', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};