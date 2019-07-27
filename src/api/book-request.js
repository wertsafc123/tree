import createRequest from './create-request';

export default createRequest({
  baseURL: process.env.BOOK_API_BASE_URL,
});
