import {
  getGroups,
  getGroupsUsers,
  getTrees,
  getUsers,
  getGroupsInfo,
  addGroups,
  editGroups,
  delGroups,
} from '../../api/api';
import i18n from '../../locales';
import { isEmpty } from '../../util';

const columns = [
  {
    title: i18n.t('label.userName'),
    key: 'title',
  },
  {
    title: i18n.t('label.position'),
    key: 'position',
    align: 'center',
  },
  {
    title: i18n.t('label.professional'),
    key: 'professional',
    align: 'center',
  },
  {
    title: i18n.t('label.email'),
    key: 'email',
    align: 'center',
  },
  {
    title: i18n.t('label.extNo'),
    key: 'extNo',
    align: 'center',
  },
  {
    title: i18n.t('label.roomNo'),
    key: 'roomNo',
    align: 'center',
  },
];

const initState = {
  loading: true,
  columns,
  list: [],
  expands: [0],
  curListIndex: 0,
  activeListIndex: [],
  form: {
    type: 'add',
    show: false,
    id: '',
    formItem: {
      name: '',
      enName: '',
      groupUserOptions: [],
    },
    preChecked: [],
  },
  info: {},
  search: {
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
  resetSearch(state) {
    Object.assign(state, {
      search: {
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
      }
    });
  },
  updateTeamUsers(state, { teamId, users }) {
    const team = state.list.find(t => t.id === teamId);
    if (team !== undefined) {
      team.children = users;
      // 触发 vuex 响应
      state.list = [...state.list];
    }
  },
  updateList(state, payload) {
    state.list = payload;
  },
  updateExpands(state, payload) {
    state.expands = payload;
  },
  updateCurListIndex(state, i) {
    state.curListIndex = i;
  },
  updateActiveListIndex(state, payload) {
    state.activeListIndex = payload;
  },
  delGroup(state, payload) {
    const nlist = [...state.list];
    nlist.splice(payload, 1);
    state.list = nlist;
  },
  openForm(state, type) {
    state.form.type = type;
    if (state.activeListIndex > -1 && type === 'edit') {
      const i = state.activeListIndex;
      const item = state.list[i];
      state.form.id = item.id;
      const { name, enName, userIds } = state.info;
      state.form.preChecked = userIds.map(item => {
        const n = {
          userId: item,
        };
        return n;
      });
      Object.assign(state.form.formItem, {
        name,
        enName,
      });
    }
    state.form.show = true;
  },
  closeForm(state) {
    state.form.show = false;
    state.form.type = 'add';
    state.form.preChecked = [];
  },
  updateGroupUserOptions(state, payload) {
    state.form.formItem.groupUserOptions = payload;
  },
  reset(state) {
    Object.assign(state, {
      list: [],
      expands: [0],
      curListIndex: 0,
      activeListIndex: [],
    });
  },
  updateInfo(state, payload) {
    state.info = payload;
  },
  startLoading(state) {
    state.loading = true;
  },
  finishLoading(state) {
    state.loading = false;
  },
};
const actions = {
  getList({ commit, rootState }) {
    const promise = new Promise((resolve, reject) => {
      const { searchType, keywords, formItem } = rootState.search;
      const ext = {
        searchType,
        keywords,
        ...formItem,
      };
      getGroups(ext)
        .then(res => {
          const { data } = res;
          commit('updateList', data);
          resolve(data);
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  getListCached({ state, dispatch }) {
    if (isEmpty(state.list)) {
      return dispatch('getList');
    } else {
      return Promise.resolve(state.list);
    }
  },
  getExpandGroupUsers({ state, commit, rootState }) {
    const teamIds = state.expands.map(i => state.list[i].id);
    const requests = [];
    // eslint-disable-next-line
    for (const id of teamIds) {
      const { searchType, keywords, formItem } = rootState.search;
      const option = {
        id,
        searchType,
        keywords,
        maxPageItems: 100,
        ...formItem,
      };
      const team = state.list.find(t => t.id === id);
      if (isEmpty(team.children)) {
        const r = getGroupsUsers(option).then(response => {
          return { response, teamId: id };
        });
        requests.push(r);
      }
    }
    return Promise.all(requests).then(responses => {
      responses.forEach(({ response, teamId }) => {
        const users = response.data.map(item => {
          return {
            title: `${item.name}`,
            ...item,
          };
        });
        commit('updateTeamUsers', {
          teamId,
          users,
        });
      });
    });
  },
  getUsers({ state, commit, rootState }) {
    const promise = new Promise((resolve, reject) => {
      const i = state.curListIndex;
      const { id } = state.list[i];
      const { searchType, keywords, formItem } = rootState.search;
      const ext = {
        id,
        searchType,
        keywords,
        maxPageItems: 100,
        ...formItem,
      };
      getGroupsUsers(ext)
        .then(res => {
          const { data } = res;
          const target = data.map(item => {
            const n = {
              title: `${item.name}`,
              ...item,
            };
            return n;
          });
          const newList = [...state.list];
          newList[i].children = target;
          commit('updateList', newList);
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  loadAllUsers({ state, commit, rootState }) {
    const newList = [...state.list];
    const { searchType, keywords, formItem } = rootState.search;
    newList.forEach((item, i) => {
      const point = item;
      point.children = [];
      const ext = {
        id: item.id,
        searchType,
        keywords,
        maxPageItems: 100,
        ...formItem,
      };
      getGroupsUsers(ext).then(res => {
        const { data } = res;
        const target = data.map(item => {
          const n = {
            title: `${item.name}`,
            ...item,
          };
          return n;
        });
        const newList = [...state.list];
        newList[i].children = target;
        commit('updateList', newList);
      });
    });
  },
  getTree({ dispatch, state }) {
    const promise = new Promise((resolve, reject) => {
      getTrees()
        .then(res => {
          const { model } = res;
          const target = [...model];
          const { searchType, keywords, formItem } = state.search;
          const comm = {
            searchType,
            keywords,
            maxPageItems: 1000,
            ...formItem,
          };
          const ps = [];

          const check = children => {
            children.forEach(item => {
              const point = item;
              point.type = 'department';
              const ext = {
                id: point.id,
                ...comm,
              };
              const payload = {
                point,
                ext,
              };
              ps.push(dispatch('getUser', payload));
              if (point.children && point.children.length) {
                check(point.children);
              }
            });
          };

          target.forEach(item => {
            const point = item;
            point.type = 'department';
            const ext = {
              id: point.id,
              ...comm,
            };
            const payload = {
              point,
              ext,
            };
            ps.push(dispatch('getUser', payload));
            if (point.children && point.children.length) {
              check(point.children);
            }
          });
          Promise.all(ps).then(result => {
            result.forEach(item => {
              const { point, data } = item;
              const newData = data.map(item => {
                const n = {
                  type: 'person',
                  groupId: point.id,
                  ...item,
                };
                return n;
              });

              if (point.children) {
                point.children = [...point.children, ...newData];
              } else {
                point.children = newData;
              }
            });
            sessionStorage.setItem('tree', JSON.stringify(target));
            resolve(target);
          });
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  loading({ dispatch, rootState }, payload) {
    const target = [...payload];
    const { searchType, keywords, formItem } = rootState.search;
    const comm = {
      searchType,
      keywords,
      ...formItem,
    };
    const ps = [];

    const check = children => {
      children.forEach(item => {
        const point = item;
        point.type = 'department';
        const ext = {
          id: point.id,
          ...comm,
        };
        const payload = {
          point,
          ext,
        };
        ps.push(dispatch('getUser', payload));
        if (point.children && point.children.length) {
          check(point.children);
        }
      });
    };

    target.forEach(item => {
      const point = item;
      point.type = 'department';
      const ext = {
        id: point.id,
        ...comm,
      };
      const payload = {
        point,
        ext,
      };
      ps.push(dispatch('getUser', payload));
      if (point.children && point.children.length) {
        check(point.children);
      }
    });

    Promise.all(ps).then(result => {
      result.forEach(item => {
        const { point, data } = item;
        const newData = data.map(item => {
          const n = {
            type: 'person',
            groupId: point.id,
            ...item,
          };
          return n;
        });

        if (point.children) {
          point.children = [...point.children, newData];
        } else {
          point.children = newData;
        }
      });
      sessionStorage.setItem('tree', JSON.stringify(target));
    });
  },
  // eslint-disable-next-line no-unused-vars
  getUser({ state }, payload) {
    const promise = new Promise((resolve, reject) => {
      const { point, ext } = payload;
      getUsers(ext)
        .then(res => {
          const { data } = res;
          const result = {
            point,
            data,
          };
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  getInfo({ state, commit }) {
    const promise = new Promise((resolve, reject) => {
      const i = state.activeListIndex;
      const { id } = state.list[i];
      const ext = {
        id,
      };
      getGroupsInfo(ext)
        .then(res => {
          const { model } = res;
          commit('updateInfo', model);
          resolve(model);
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  addItem({ state, dispatch }) {
    const promise = new Promise((resolve, reject) => {
      const ext = state.form.formItem;
      addGroups(ext)
        .then(() => {
          dispatch('getList').then(() => {
            dispatch('getExpandGroupUsers');
            resolve();
          });
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  editItem({ state, dispatch }) {
    const promise = new Promise((resolve, reject) => {
      const ext = state.form.formItem;
      ext.id = state.form.id;
      editGroups(ext)
        .then(() => {
          dispatch('getList').then(() => {
            dispatch('getExpandGroupUsers');
            resolve();
          });
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
  delItem({ state, dispatch }) {
    const promise = new Promise((resolve, reject) => {
      const i = state.activeListIndex;
      const { id } = state.list[i];
      const ext = {
        id,
      };
      delGroups(ext)
        .then(() => {
          dispatch('getList').then(() => {
            dispatch('getExpandGroupUsers');
            resolve();
          });
        })
        .catch(e => {
          reject(e);
        });
    });
    return promise;
  },
};

export default {
  namespaced: true,
  state: initState,
  getters,
  mutations,
  actions,
};
