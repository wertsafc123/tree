import xhr from './book-request';

// 部门列表
export function getDepartments(ext) {
  const promise = new Promise((resolve, reject) => {
    const {
      searchType,
      keywords,
      email,
      extNo,
      position,
      professional,
      roomNo,
      staffNo,
      userName,
    } = ext;
    xhr
      .request({
        url: 'departments',
        method: 'get',
        params: {
          searchType,
          keywords,
          email,
          extNo,
          position,
          professional,
          roomNo,
          staffNo,
          userName,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 获取部门下的人员
export function getUsers(ext) {
  const promise = new Promise((resolve, reject) => {
    const {
      id,
      searchType,
      keywords,
      email,
      extNo,
      position,
      professional,
      roomNo,
      staffNo,
      userName,
      maxPageItems,
    } = ext;
    xhr
      .request({
        url: `departments/${id}/users`,
        method: 'get',
        params: {
          searchType,
          keywords,
          email,
          extNo,
          position,
          professional,
          roomNo,
          staffNo,
          userName,
          maxPageItems,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 獲取全部職務(部門下人員編輯用到)
export function getPositions() {
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'departments/positions',
        method: 'get',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 獲取全部職稱(部門下人員編輯用到)
export function getProfessionals() {
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'departments/professionals',
        method: 'get',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 编辑用户
export function updateUsers(ext) {
  const {
    id,
    userId,
    nickName,
    enName,
    positionId,
    professionalId,
    email,
    extNo,
    roomNo,
  } = ext;
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: `departments/${id}/users/${userId}/update`,
        method: 'post',
        data: {
          nickName,
          enName,
          positionId,
          professionalId,
          email,
          extNo,
          roomNo,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 导出通讯录
export function getExport() {
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'departments/export/-1',
        method: 'get',
        responseType: 'blob',
        withCredentials: true,
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 通讯录应用获取部门树结构[群組編輯添加時使用,獲取部門下的人員 請調用(/departments/{id}/users)]
export function getTrees() {
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'departments/trees',
        method: 'get',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 群组列表
export function getGroups(ext) {
  const promise = new Promise((resolve, reject) => {
    const {
      searchType,
      keywords,
      email,
      extNo,
      position,
      professional,
      roomNo,
      staffNo,
      userName,
    } = ext;
    xhr
      .request({
        url: 'groups',
        method: 'get',
        params: {
          searchType,
          keywords,
          email,
          extNo,
          position,
          professional,
          roomNo,
          staffNo,
          userName,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}
// 新增群组
export function addGroups(ext) {
  const { name, enName, groupUserOptions } = ext;
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'groups/',
        method: 'post',
        data: {
          name,
          enName,
          groupUserOptions,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}
// 修改群組记录
export function editGroups(ext) {
  const { id, name, enName, groupUserOptions } = ext;
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: `groups/${id}`,
        method: 'post',
        data: {
          name,
          enName,
          groupUserOptions,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}
// 获取群组详情
export function getGroupsInfo(ext) {
  const { id } = ext;
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: `groups/${id}`,
        method: 'get',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 删除群組记录
export function delGroups(ext) {
  const { id } = ext;
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: `groups/${id}/remove`,
        method: 'post',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 获取群组下人員记录
export function getGroupsUsers(ext) {
  const promise = new Promise((resolve, reject) => {
    const {
      id,
      searchType,
      keywords,
      email,
      extNo,
      position,
      professional,
      roomNo,
      staffNo,
      userName,
      maxPageItems,
    } = ext;
    xhr
      .request({
        url: `groups/${id}/users`,
        method: 'get',
        params: {
          searchType,
          keywords,
          email,
          extNo,
          position,
          professional,
          roomNo,
          staffNo,
          userName,
          maxPageItems,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 最近聯係人列表
export function getContacts(ext) {
  const promise = new Promise((resolve, reject) => {
    const {
      searchType,
      keywords,
      email,
      extNo,
      position,
      professional,
      roomNo,
      staffNo,
      userName,
      maxPageItems,
    } = ext;
    xhr
      .request({
        url: 'contacts',
        method: 'get',
        params: {
          searchType,
          keywords,
          email,
          extNo,
          position,
          professional,
          roomNo,
          staffNo,
          userName,
          maxPageItems,
        },
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}

// 清空最近聯係人
export function contactsClear() {
  const promise = new Promise((resolve, reject) => {
    xhr
      .request({
        url: 'contacts/clear',
        method: 'post',
      })
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
  return promise;
}
