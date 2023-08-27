// initial state
// shape: [{ id, quantity }]
const state = () => ({
    user: null,
});

// getters
const getters = {};

// actions
const actions = {
    handleSetUser({ commit }, user) {
        commit("setUser", user);
    }
};

// mutations

const mutations = {
    setUser(state, payload) {
        state.user = payload;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};