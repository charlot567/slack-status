const apiUrl = "https://slack.com/api/";
const fetch = require("node-fetch");
exports.customFetch = async (body, route) => {
  return new Promise((resolve, reject) => {
    try {
      callApi(body, apiUrl + route, "POST").then(resp => {
        const response = resp.clone();
        resp.json().then(data => {
          resolve(response);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

const callApi = (body, url, method) => {
  return fetch(url, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Bearer xoxp-275953048624-438404608454-848092166532-2ea297f3f6a59700c02f67eb0b54d6c9"
    },
    body: method === "POST" ? JSON.stringify(body) : undefined
  });
};

const encodeData = data =>
  Object.keys(data)
    .map(function(key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
    })
    .join("&");
