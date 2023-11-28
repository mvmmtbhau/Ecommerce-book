// initial state
// shape: [{ id, quantity }]
const state = () => ({
    wishlist: null,
});

// getters
const getters = {};

// actions
const actions = {
    setWishlist({ commit }, wishlist) {
        commit("setWishlist", wishlist);
    }
};

// mutations

const mutations = {
    setWishlist(state, data) {
        state.wishlist = data;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};