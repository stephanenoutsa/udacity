<template>
  <v-card class="mx-auto" max-width="400">
    <v-img
      v-if="urlValid"
      class="white--text align-end"
      height="200px"
      :src="artwork.attachmentUrl"
    >
      <v-card-title>
        {{ artwork.title }}
      </v-card-title>
    </v-img>

    <v-card-title v-else>
      {{ artwork.title }}
    </v-card-title>

    <v-card-subtitle class="pb-0">
      {{ artwork.createdAt }}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <div>
        {{ artwork.description }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="editArtwork"
      >
        Edit
      </v-btn>

      <v-btn color="danger" text @click="deleteArtwork">
        Delete
      </v-btn>
    </v-card-actions>

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
  </v-card>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import { apiModel, makeApiRequest } from "@/api";

export default {
  name: "Artwork",

  computed: {
    ...mapGetters(["artworks"]),

    mArtworks: function() {
      return this.artworks;
    }
  },

  props: ["artwork"],

  data() {
    return {
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
      notificationMessage: null,
      urlValid: null
    };
  },

  methods: {
    async editArtwork() {
      // Set artwork state via mutations
      const artwork = this.artwork
      this.$store.commit('setArtworkState', { artwork });

      // Redirect to edit view
      this.$router.push({ name: 'edit-artwork', params: { artwork: this.artwork.artworkId } })
    },

    async deleteArtwork() {
      const tokenObj = await this.$auth.getIdTokenClaims();
      const token = tokenObj.__raw;

      const args = {
        artwork: this.artwork.artworkId
      }

      try {
        const response = await makeApiRequest(
          args,
          apiModel.Artwork.Delete,
          token,
          {}
        );

        const status = response.status;

        if (status === 200) {
          // Set artworks state via mutations
          const newArtworks = this.mArtworks.filter(a => {
            return a.artworkId !== this.artwork.artworkId;
          });

          this.$store.commit("setArtworksState", { artworks: newArtworks });
        } else {
          this.snack("error", response.message, this.notificationIcons.error);
        }
      } catch (err) {
        this.snack("error", err, this.notificationIcons.error);
      }
    },

    async checkAttachmentURL() {
      try {
        await axios.get(this.artwork.attachmentUrl)

        this.urlValid = true
      } catch {
        this.urlValid = false
      }
    },

    snack(color, err, icon) {
      this.color = color;
      this.snackbar = true;
      this.notificationMessage = err;
      this.notificationIcon = icon;
    }
  },

  async mounted() {
    await this.checkAttachmentURL()
  }
};
</script>
