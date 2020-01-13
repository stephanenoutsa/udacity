// States
const state = {
  artworks: [],
  artwork: {}
};

// Getters
const getters = {
  artworks: state => {
    return state.artworks;
  },

  artwork: state => {
    return state.artwork;
  }
};

// Actions
const actions = {};

// Mutations
const mutations = {
  setArtworksState(state, { artworks }) {
    // Update artworks state
    state.artworks = artworks;
  },

  setArtworkState(state, { artwork }) {
    // Update artwork state
    state.artwork = artwork;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
