import createRequest from './create-request';

export default createRequest({
  baseURL: process.env.OA_API_BASE_URL,
});
