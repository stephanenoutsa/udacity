import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import { Auth0Plugin } from "./auth";

// Import the Auth0 configuration
import { authConfig } from "./config/auth";

const { domain, clientId } = authConfig;

// Install the authentication plugin here
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
  }
});

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
