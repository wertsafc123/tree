const initState = {
  searchType: 'EASY_SEARCH',
  keywords: '',
  show: false,
  formItem: {
    userName: '',
    email: '',
    roomNo: '',
    extNo: '',
    position: '',
    staffNo: '',
    professional: '',
  },
};

const getters = {};
const mutations = {
  updateKeywords(state, payload) {
    state.keywords = payload;
  },
  open(state) {
    state.show = true;
  },
  close(state) {
    state.show = false;
  },
  clear(state) {
    state.formItem = {
      userName: '',
      email: '',
      roomNo: '',
      extNo: '',
      position: '',
      staffNo: '',
      professional: '',
    };
  },
  setSearchMode(state, mode) {
    state.searchType = mode;
  },
  reset(state) {
    Object.assign(state, {
      searchType: 'EASY_SEARCH',
      keywords: '',
      show: false,
      formItem: {
        userName: '',
        email: '',
        roomNo: '',
        extNo: '',
        position: '',
        staffNo: '',
        professional: '',
      },
    });
  },
};
const actions = {};

export default {
  namespaced: true,
  state: initState,
  getters,
  mutations,
  actions,
};
