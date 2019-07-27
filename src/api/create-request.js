import axios from 'axios';
import Cookie from 'js-cookie';
import { decodeToken } from '../util';

const createRequest = ({ baseURL }) => {
  const xhr = axios.create({
    baseURL,
    timeout: 20000,
    params: {
    },
  });

  xhr.interceptors.request.use(
    reqConfig => {
      const authCookieKey = process.env.AUTH_INFO_COOKIE_KEY;
      const token = decodeToken(Cookie.get(authCookieKey));
      // eslint-disable-next-line no-param-reassign
      reqConfig.headers.Authorization = token.accessToken;

      const langCookieKey = process.env.APP_LANG_COOKIE_KEY;
      const lang = Cookie.get(langCookieKey);
      // eslint-disable-next-line no-param-reassign
      reqConfig.params.lang = lang;

      return reqConfig;
    },
  );

  xhr.interceptors.response.use(
    response => {
      const { request, data } = response;
      let result;
      if (request.responseType === 'blob' && data.size) {
        result = Promise.resolve(response);
      } else if (data.success) {
        result = Promise.resolve(data);
      } else {
        result = Promise.reject(data);
      }
      return result;
    },
    e => {
      // 对响应错误做点什么
      const { response } = e;
      return Promise.reject(response);
    },
  );

  return xhr;
};

export default createRequest;
