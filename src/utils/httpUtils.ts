import axios from 'axios';
// import { Message } from 'element-ui';
import router from '../router';

axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';


// http request 拦截器
axios.interceptors.request.use(
  config => {
    // const token = getCookie('名称');注意使用的时候需要引入cookie方法，推荐js-cookie
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    // if(token){
    //   config.params = {'token':token}
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.errCode === 2) {
      router.push({
        path: '/login',
        // query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      });
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);


/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export async function get(url: string, params = {}) {
  try {
    const res = await axios.get(url, { params });
    return res.data;
  } catch (err) {
    console.log(err);
  }
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export async function post(url: string, data = {}) {
  try {
    const res = await axios.post(url, data);
    if (res.status === 200) {
      console.log(res);
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
}

/***
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}

/***
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url: string, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      });
  });
}