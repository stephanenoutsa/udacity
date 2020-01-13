<template>
  <v-container>
    <template v-if="!$auth.loading && !$auth.isAuthenticated">Please login</template>

    <template v-else>
      <v-layout wrap>
        <v-flex xs12>
          <v-btn dark color="primary" :to="{ name: 'create-artwork' }">
            Create Artwork
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-flex>

        <v-btn v-if="loading" text color="primary" loading />

        <v-flex xs12 v-else>
          <v-container>
            <v-card flat>
              <template v-if="mArtworks.length">
                <v-layout row wrap>
                  <v-flex xs12 sm4 md6 v-for="artwork in mArtworks" :key="artwork.artworkId">
                    <artwork :artwork="artwork"></artwork>
                  </v-flex>
                </v-layout>
              </template>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </template>

    <v-snackbar
      :color="color"
      :bottom="bottom"
      :top="top"
      :left="left"
      :right="right"
      v-model="snackbar"
      dark
    >
      <v-icon color="white" class="mr-3">{{ notificationIcon }}</v-icon>

      <div>{{ notificationMessage }}</div>

      <v-icon size="16" @click="snackbar = false">mdi-close-circle</v-icon>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { apiModel, makeApiRequest } from "@/api";
import Artwork from "@/components/Artwork.vue";

export default {
  name: "ArtworkList",

  components: {
    Artwork
  },

  computed: {
    ...mapGetters(["artworks"]),

    mArtworks: function() {
      return this.artworks;
    }
  },

  data() {
    return {
      authState: !this.$auth.loading && this.$auth.isAuthenticated,
      loading: true,
      color: null,
      top: true,
      bottom: false,
      left: false,
      right: true,
      snackbar: false,
      notificationIcons: {
        success: "mdi-check-circle",
        error: "mdi-alert-octagon"
      },
      notificationIcon: null,
      notificationMessage: null
    };
  },

  methods: {
    async getArtworks() {
      const tokenObj = await this.$auth.getIdTokenClaims()
      const token = tokenObj.__raw

      try {
        const response = await makeApiRequest(
          {},
          apiModel.Artwork.List,
          token,
          {}
        );

        const status = response.status;

        if (status === 200) {
          // Set artworks state via mutations
          const artworks = response.data.items
          this.$store.commit('setArtworksState', { artworks });
        } else {
          this.snack("error", response.message, this.notificationIcons.error);
        }
      } catch (err) {
        this.snack("error", err, this.notificationIcons.error);
      } finally {
        this.loading = false
      }
    },

    snack(color, err, icon) {
      this.color = color;
      this.snackbar = true;
      this.notificationMessage = err;
      this.notificationIcon = icon;
    }
  },

  watch: {
    // eslint-disable-next-line
    authState: (newState, oldState) => {
      if (newState === !this.$auth.loading && this.$auth.isAuthenticated) {
        this.getArtworks()
      }
    }
  },

  async mounted() {
    if (!this.$auth.loading && this.$auth.isAuthenticated) {
      // Retrieve list of artworks
      await this.getArtworks();
    }
  }
};
</script>