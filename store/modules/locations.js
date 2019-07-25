import {
  getField,
  updateField }     from 'vuex-map-fields';

export const locationsState = () => ({
  indianapolis: {
    location: 'Indianapolis',
    website: {
      url: 'http://www.in.gov',
      text: 'www.in.gov'
    },
    socials: {
      facebook: {
        url: 'https://www.facebook.com/IndianaGovernment',
        text: '@IndianaGovernment'
      },
      twitter: {
        url: 'https://twitter.com/IN_gov',
        text: '@in_gov'
      },
      instagram: {
        url: 'https://www.instagram.com/in_gov/',
        text: '@in_gov'
      },
      youtube: {
        url: 'https://www.youtube.com/user/IndianaGovernment/videos',
        text: 'IndianaGovernment YouTube'
      }
    },
    phone: {
      number: '1-800-457-8283'
    }
  },
  monroeCounty: {
    location: 'Monroe County',
    website: {
      url: 'http://www.co.monroe.in.us',
      text: 'www.co.monroe.in.us'
    },
    socials: {
      facebook: {
        url: 'https://www.facebook.com/monroecoboardofcommissioners',
        text: '@monroecoboardofcommissioners'
      },
      twitter: {
        url: 'https://twitter.com/MonroeCoBoC',
        text: '@MonroeCoBoC'
      },
    },
    phone: {
      number: '812-349-2550'
    }
  },
  bloomington: {
    location: 'Bloomington',
    website: {
      url: 'http://bloomington.in.gov',
      text: 'bloomington.in.gov'
    },
    socials: {
      facebook: {
        url: 'https://www.facebook.com/cityofbloomington',
        text: '@cityofbloomington'
      },
      twitter: {
        url: 'http://twitter.com/citybloomington',
        text: '@citybloomington'
      },
    },
    phone: {
      number: '812-849-3400'
    }
  },
  ellettsville: {
    location: 'Ellettsville',
    website: {
      url: 'http://www.ellettsville.in.us',
      text: 'ellettsville.in.us'
    },
    socials: {
      facebook: {
        url: 'https://www.facebook.com/cityofbloomington',
        text: '@cityofbloomington'
      },
      twitter: {
        url: 'http://twitter.com/citybloomington',
        text: '@citybloomington'
      },
    },
    phone: {
      number: '812-876-3860'
    }
  }
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