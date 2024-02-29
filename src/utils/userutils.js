import { getCookieValue } from '@/utils/cookieutils';
import axios from 'axios';

// 检查登录状态的函数
export function checkLoginStatus() {
  // 从 Cookie 中读取 fp
  const cookieStr = document.cookie;
  const fpIndex = cookieStr.indexOf('fp=');


  return fpIndex !== -1;
}

export function getUserInfo() {
  return new Promise((resolve, reject) => {
      axios.post('http://127.0.0.1:5000/user/get', {
          fp: getCookieValue("fp")
      }, {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          withCredentials: true
      }).then(response => {
          if (response.data.code === 200) {
              resolve(response.data.data);
          } else {
              reject(new Error('Failed to get user info'));
          }
      }).catch(error => {
          reject(error);
      });
  });
}