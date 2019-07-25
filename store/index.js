import Vuex         from 'vuex'
import {
  getField,
  updateField }     from 'vuex-map-fields'

import locations    from './modules/locations'
import sanitation   from './modules/sanitation'
import contacts     from './modules/contacts'

export const strict = false;

export const defaultState = () => ({
  consoleLog: {
    info:           ['background: rgb(30, 90, 174)',
                    'color: white',
                    'display: block',
                    'border-radius: 3px',
                    'padding: 2px 0'].join(';'),

    success:        ['background: rgb(76, 174, 79)',
                    'color: white',
                    'display: block',
                    'border-radius: 3px',
                    'padding: 2px 0'].join(';'),

    error:          ['background: rgb(235, 59, 36)',
                    'color: white','display: block',
                    'border-radius: 3px',
                    'padding: 2px 0'].join(';')
  },
})

const state = () => defaultState();

export const mutations = {
  updateField,
  RESET_BASE_STATE(state) {
    Object.assign(state, defaultState())
  }
}

export const actions = {
  resetBaseState({ commit }) {
    commit('RESET_BASE_STATE')
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
  modules: {
    locations:      locations,
    sanitation:     sanitation,
    contacts:       contacts
  },
  mutations,
  actions,
  getters,
  state,
};