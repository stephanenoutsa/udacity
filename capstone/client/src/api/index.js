import { apiEndpoint } from "@/config/auth";
import Vue from "vue";

export const apiModel = {
  Artwork: {
    List: {
      method: "GET",
      url: "/artworks"
    },
    Get: {
      method: "GET",
      url: "/artworks/:artwork"
    },
    Create: {
      method: "POST",
      url: "/artworks"
    },
    Update: {
      method: "PATCH",
      url: "/artworks/:artwork"
    },
    Delete: {
      method: "DELETE",
      url: "/artworks/:artwork"
    },
    Upload: {
      method: "POST",
      url: "/artworks/:artwork/attachment"
    }
  }
};

export const makeApiRequest = async (
  args,
  object,
  token = "",
  // successCallback = {},
  // errorCallback = {},
  errorMessages = {}
) => {
  const self = this;
  const method = object.method;
  let urlSuffix = object.url;
  let finalUrlSuffix = "";

  // Adjust API url
  if (Object.keys(args).length === 0 && args.constructor === Object) {
    finalUrlSuffix = urlSuffix;
  } else {
    Object.keys(args).forEach(key => {
      finalUrlSuffix = urlSuffix.replace(`:${key}`, args[key]);
      urlSuffix = finalUrlSuffix;
    });
  }

  // Set headers
  let customHeaders = {};
  customHeaders["headers"] = {};

  // Set token in request header if necessary
  if (token !== "") {
    customHeaders["headers"]["Authorization"] = `Bearer ${token}`;
  }

  let response;

  switch (method) {
    case "POST":
      try {
        response = await Vue.axios.post(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );
        // .then(successCallback)
        // .catch(error => {
        //   if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("Data:", error.response.data);
        //     console.log("Status:", error.response.status);
        //     console.log("Headers:", error.response.headers);

        //     Vue.notify({
        //       type: "error",
        //       title: error.response.data.message
        //     });
        //   } else if (error.request) {
        //     // The request was made but no response was received
        //     // 'error.request' is an isntance of XMLHttpRequest in the browser and an instance of
        //     // http.ClientRequest in node.js
        //     console.log("Request error", error.request);

        //     Vue.notify({
        //       type: "error",
        //       title: self.errorMessages.generic
        //     });
        //   } else {
        //     // Something happened in setting up the request that triggered an Error
        //     console.log("Error", error.message);

        //     Vue.notify({
        //       type: "error",
        //       title: error.message
        //     });
        //   }

        //   console.log("Config error:", error.config);
        // });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;

    case "GET":
      try {
        response = await Vue.axios.get(apiEndpoint + finalUrlSuffix.trim(), {
          params: args,
          headers: customHeaders["headers"]
        });
        // .then(successCallback)
        // .catch(error => {
        //   if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("Data:", error.response.data);
        //     console.log("Status:", error.response.status);
        //     console.log("Headers:", error.response.headers);

        //     Vue.notify({
        //       type: "error",
        //       title: error.response.data.message
        //     });
        //   } else if (error.request) {
        //     // The request was made but no response was received
        //     // 'error.request' is an isntance of XMLHttpRequest in the browser and an instance of
        //     // http.ClientRequest in node.js
        //     console.log("Request error", error.request);

        //     Vue.notify({
        //       type: "error",
        //       title: self.errorMessages.generic
        //     });
        //   } else {
        //     // Something happened in setting up the request that triggered an Error
        //     console.log("Error", error.message);

        //     Vue.notify({
        //       type: "error",
        //       title: error.message
        //     });
        //   }

        //   console.log("Config error:", error.config);
        // });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: errorMessages.generic
        });
      }

      break;

    case "PUT":
      try {
        response = await Vue.axios.put(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );
        // .then(successCallback)
        // .catch(error => {
        //   if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("Data:", error.response.data);
        //     console.log("Status:", error.response.status);
        //     console.log("Headers:", error.response.headers);

        //     Vue.notify({
        //       type: "error",
        //       title: error.response.data.message
        //     });
        //   } else if (error.request) {
        //     // The request was made but no response was received
        //     // 'error.request' is an isntance of XMLHttpRequest in the browser and an instance of
        //     // http.ClientRequest in node.js
        //     console.log("Request error", error.request);

        //     Vue.notify({
        //       type: "error",
        //       title: self.errorMessages.generic
        //     });
        //   } else {
        //     // Something happened in setting up the request that triggered an Error
        //     console.log("Error", error.message);

        //     Vue.notify({
        //       type: "error",
        //       title: error.message
        //     });
        //   }

        //   console.log("Config error:", error.config);
        // });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: errorMessages.generic
        });
      }

      break;

    case "PATCH":
      try {
        // NB: Quick fix
        // Remove 'artwork' from request boy
        delete args["artwork"];

        response = await Vue.axios.patch(
          apiEndpoint + finalUrlSuffix.trim(),
          args,
          customHeaders
        );
        // .then(successCallback)
        // .catch(error => {
        //   if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("Data:", error.response.data);
        //     console.log("Status:", error.response.status);
        //     console.log("Headers:", error.response.headers);

        //     Vue.notify({
        //       type: "error",
        //       title: error.response.data.message
        //     });
        //   } else if (error.request) {
        //     // The request was made but no response was received
        //     // 'error.request' is an isntance of XMLHttpRequest in the browser and an instance of
        //     // http.ClientRequest in node.js
        //     console.log("Request error", error.request);

        //     Vue.notify({
        //       type: "error",
        //       title: self.errorMessages.generic
        //     });
        //   } else {
        //     // Something happened in setting up the request that triggered an Error
        //     console.log("Error", error.message);

        //     Vue.notify({
        //       type: "error",
        //       title: error.message
        //     });
        //   }

        //   console.log("Config error:", error.config);
        // });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;

    case "DELETE":
      try {
        response = await Vue.axios.delete(
          apiEndpoint + finalUrlSuffix.trim(),
          customHeaders
        );
        // .then(successCallback)
        // .catch(error => {
        //   if (error.response) {
        //     // The request was made and the server responded with a status code
        //     // that falls out of the range of 2xx
        //     console.log("Data:", error.response.data);
        //     console.log("Status:", error.response.status);
        //     console.log("Headers:", error.response.headers);

        //     Vue.notify({
        //       type: "error",
        //       title: error.response.data.message
        //     });
        //   } else if (error.request) {
        //     // The request was made but no response was received
        //     // 'error.request' is an isntance of XMLHttpRequest in the browser and an instance of
        //     // http.ClientRequest in node.js
        //     console.log("Request error", error.request);

        //     Vue.notify({
        //       type: "error",
        //       title: self.errorMessages.generic
        //     });
        //   } else {
        //     // Something happened in setting up the request that triggered an Error
        //     console.log("Error", error.message);

        //     Vue.notify({
        //       type: "error",
        //       title: error.message
        //     });
        //   }

        //   console.log("Config error:", error.config);
        // });

        return response;
      } catch (error) {
        Vue.notify({
          type: "error",
          title: self.errorMessages.generic
        });
      }

      break;
  }
};
