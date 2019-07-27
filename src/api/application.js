import URI from 'urijs';
import http from './oa-request';

/**
 * 應用的 url 爲空字符串, 然而 <common-header/>
 * 又通過 url 爲空字串來認定它爲應用, 所以這裡讓空字符爲非法 url
 * addLocaleQuery 就不會對他進行任何處理, 讓他保持爲空字符串
 * 好滿足 <common-header/> 的代碼邏輯 ...
 */
const isValidUrl = url => {
  return url !== '';
};

const addLocaleQuery = url => {
  const query = 'locale';
  if (isValidUrl(url) && !URI(url).hasQuery(query)) {
    return URI(url).addQuery(query, 'zh_MO');
  } else {
    return url;
  }
};

const convertUrls = list => {
  list.forEach(item => {
    // eslint-disable-next-line no-param-reassign
    item.url = addLocaleQuery(item.url);
  });
  return list;
};

export function getMenu({ serviceCode }) {
  const option = {
    params: { serviceCode },
  };
  return http.get('/menus', option).then(res => {
    convertUrls(res.model.headMenuList);
    convertUrls(res.model.createMenuList);
    convertUrls(res.model.leftMenuList);
    return res;
  });
}

export function getMessageNum() {
  return http.get('/message-count').then(res => {
    // eslint-disable-next-line no-param-reassign
    res.model.url = addLocaleQuery(res.model.url);
    return res;
  });
}

export function getServers(serviceCode) {
  const option = {
    params: { serviceCode },
  };
  return http.get('/service-url', option).then(res => {
    convertUrls(res.model.help);
    convertUrls(res.model.userAndEntrust);
    return res;
  });
}

export function getApplications({ keywords } = {}) {
  const option = {
    params: { keywords },
  };
  return http.get('/applications', option).then(res => {
    convertUrls(res.model);
    return res;
  });
}

export function getStudentTree({ groupId }) {
  return http.get(`/student-data/${groupId}`);
}

export function getStudentGroup() {
  return http.get('/student-group-trees-data');
}

export function getTeacherTree() {
  return http.get('/teacher-trees-data');
}

export function getUserInfo() {
  return http.get('/user-info');
}
