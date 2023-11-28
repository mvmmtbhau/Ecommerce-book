// initial state
// shape: [{ id, quantity }]
const state = () => ({
    cart: null,
});

// getters
const getters = {};

// actions
const actions = {
    setCart({ commit }, cart) {
        commit("setCart", cart);
    },
    changeQuantity({commit}, data) {
        commit("changeQuantity", data);
    }
};

// mutations

const mutations = {
    setCart(state, data) {
        state.cart = data;
    },
    changeQuantity(state, data) {
        state.cart.products[data.index].quantity = data.quantity;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};