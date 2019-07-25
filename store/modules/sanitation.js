import {
  getField,
  updateField }     from 'vuex-map-fields';

export const sanitationState = () => ({
  a: {
    Monday:         'https://bloomington.in.gov/sanitation/trash/monday-a',
    Tuesday:        'https://bloomington.in.gov/sanitation/trash/tuesday-a',
    Wednesday:      'https://bloomington.in.gov/sanitation/trash/wednesday-a',
    Thursday:       'https://bloomington.in.gov/sanitation/trash/thursday-a'
  },
  b: {
    Monday:         'https://bloomington.in.gov/sanitation/trash/monday-b',
    Tuesday:        'https://bloomington.in.gov/sanitation/trash/tuesday-b',
    Wednesday:      'https://bloomington.in.gov/sanitation/trash/wednesday-b',
    Thursday:       'https://bloomington.in.gov/sanitation/trash/thursday-b'
  }
})

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