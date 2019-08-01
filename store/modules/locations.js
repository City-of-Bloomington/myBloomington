import {
  getField,
  updateField }     from 'vuex-map-fields';

export const locationsState = () => ({
  indianapolis: {
    type: 'State',
    location: 'Indianapolis',
    website: {
      url: 'https://www.in.gov/',
      text: 'www.in.gov'
    },
    socials: {
      facebook: {
        type: 'facebook',
        url: 'https://www.facebook.com/IndianaGovernment',
        text: '@IndianaGovernment'
      },
      twitter: {
        type: 'twitter',
        url: 'https://twitter.com/IN_gov',
        text: '@in_gov'
      },
      instagram: {
        type: 'instagram',
        url: 'https://www.instagram.com/in_gov/',
        text: '@in_gov'
      },
      youtube: {
        type: 'youtube',
        url: 'https://www.youtube.com/user/IndianaGovernment/videos',
        text: 'IndianaGovernment YouTube'
      }
    },
    phone: {
      number: '1-800-457-8283'
    }
  },
  monroeCounty: {
    type: 'County',
    location: 'Monroe County',
    website: {
      url: 'http://www.co.monroe.in.us',
      text: 'www.co.monroe.in.us'
    },
    socials: {
      facebook: {
        type: 'facebook',
        url: 'https://www.facebook.com/monroecoboardofcommissioners',
        text: '@monroecoboardofcommissioners'
      },
      twitter: {
        type: 'twitter',
        url: 'https://twitter.com/MonroeCoBoC',
        text: '@MonroeCoBoC'
      },
    },
    phone: {
      number: '812-349-2550'
    }
  },
  bloomington: {
    type: 'City',
    location: 'Bloomington',
    website: {
      url: 'http://bloomington.in.gov',
      text: 'bloomington.in.gov'
    },
    socials: {
      facebook: {
        type: 'facebook',
        url: 'https://www.facebook.com/cityofbloomington',
        text: '@cityofbloomington'
      },
      twitter: {
        type: 'twitter',
        url: 'http://twitter.com/citybloomington',
        text: '@citybloomington'
      },
    },
    phone: {
      number: '812-849-3400'
    }
  },
  // ellettsville: {
  //   type: 'City',
  //   location: 'Ellettsville',
  //   website: {
  //     url: 'http://www.ellettsville.in.us',
  //     text: 'ellettsville.in.us'
  //   },
  //   phone: {
  //     number: '812-876-3860'
  //   }
  // }
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