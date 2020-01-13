import Vue from "vue";
import Vuetify from "vuetify/lib";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "mdi" // default - only for display purposes
  },
  theme: {
    themes: {
      light: {
        primary: "#00bcd4",
        secondary: "#03a9f4",
        accent: "#673ab7",
        error: "#e91e63",
        warning: "#ffc107",
        info: "#2196f3",
        success: "#009688"
      },
      dark: {
        primary: "#00bcd4",
        secondary: "#03a9f4",
        accent: "#673ab7",
        error: "#e91e63",
        warning: "#ffc107",
        info: "#2196f3",
        success: "#009688"
      }
    }
  }
});
