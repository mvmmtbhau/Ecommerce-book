// initial state
// shape: [{ id, quantity }]
const state = () => ({
    isLogin: false,
    user: null,
});

// getters
const getters = {};

// actions
const actions = {
    setUser({ commit }, user) {
        commit("setUser", user);
    }
};

// mutations

const mutations = {
    setUser(state, data) {
        state.user = data;
        state.isLogin = true;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};