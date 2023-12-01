import axios, { Method } from "axios";
const isProd = process.env.NODE_ENV === "production";
const BASE_URL = isProd ? "/api/" : "http://localhost:3030/api/";

async function ajax(endpoint: string, method: Method = "GET", data: object | null = null) {
  try {
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === "GET" ? data : null,
      withCredentials: true,
    });

    // if (res.status === 200) {
    //   const cache = await caches.open("api-cache");
    //   const responseToCache = new Response(JSON.stringify(res.data), {
    //     headers: { "Content-Type": "application/json" },
    //   });
    //   await cache.put(`${BASE_URL}${endpoint}`, responseToCache);
    // }

    return res.data;
  } catch (err) {
    // const chache = await caches.open("api-cache");
    // const cachedResponse = await chache.match(`${BASE_URL}${endpoint}`);
    // if (cachedResponse) return await cachedResponse.json();
    if (isProd) return;
    if (data && "password" in data) delete data["password"];
    // eslint-disable-next-line no-console
    console.log(`Had issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data);
    console.error(err);
    throw err;
  }
}

export default {
  get(endpoint: string, data?: object) {
    return ajax(endpoint, "GET", data);
  },
  post(endpoint: string, data?: object) {
    return ajax(endpoint, "POST", data);
  },
  put(endpoint: string, data?: object) {
    return ajax(endpoint, "PUT", data);
  },
  patch(endpoint: string, data?: object) {
    return ajax(endpoint, "PATCH", data);
  },
  delete(endpoint: string, data?: object) {
    return ajax(endpoint, "DELETE", data);
  },
};
