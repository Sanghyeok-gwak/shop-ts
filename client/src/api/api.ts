import axios from 'axios';

// 서버 주소를 한 곳에 모아 두고, 요청할 때는 '/products'처럼 뒷부분만 적습니다.
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default api;