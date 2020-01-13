<template>
  <v-card color="grey lighten-4" flat>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Nouts'Art Gallery</v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Check that the SDK client is not currently loading before accessing its methods -->
      <template v-if="!$auth.loading">
        <!-- show login when not authenticated -->
        <v-btn dark class="primary" v-if="!$auth.isAuthenticated" @click="login">Log in</v-btn>

        <!-- show logout when authenticated -->
        <v-btn dark color="danger" v-if="$auth.isAuthenticated" @click="logout">Log out</v-btn>
      </template>
    </v-toolbar>

    <router-view />
  </v-card>
</template>

<script>
export default {
  methods: {
    // Log the user in
    login() {
      this.$auth.loginWithRedirect();
    },

    // Log the user out
    logout() {
      this.$auth.logout({
        returnTo: window.location.origin
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
