<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="mArtwork.title"
        :rules="titleRules"
        label="Title"
        required
      ></v-text-field>

      <v-textarea
        solo
        v-model="mArtwork.description"
        :rules="descriptionRules"
        label="Description"
        required
      ></v-textarea>

      <v-file-input
        v-model="image"
        placeholder="Select your artwork"
        chips
        show-size
        accept="image/*"
        label="Image"
      ></v-file-input>

      <v-btn
        :disabled="!valid"
        color="success"
        class="mr-4"
        @click="editArtwork"
      >
        Submit
      </v-btn>
    </v-form>

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
import axios from "axios";
import { mapGetters } from "vuex";
import { apiModel, makeApiRequest } from "@/api";

export default {
  name: "EditArtwork",

  computed: {
    ...mapGetters(["artwork", "artworks"]),

    mArtwork: function() {
      return this.artwork;
    },

    mArtworks: function() {
      return this.artworks;
    }
  },

  data() {
    return {
      valid: true,
      token: null,
      titleRules: [v => !!v || "Title is required"],
      descriptionRules: [v => !!v || "Description is required"],
      image: null,
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
    async editArtwork() {
      try {
        const tokenObj = await this.$auth.getIdTokenClaims();
        const token = tokenObj.__raw;
        this.token = token;

        const args = {
          artwork: this.mArtwork.artworkId,
          title: this.mArtwork.title,
          description: this.mArtwork.description
        };

        const response = await makeApiRequest(
          args,
          apiModel.Artwork.Update,
          token,
          {}
        );

        const status = response.status;

        if (status === 200) {
          // Set artworks state via mutations
          const newArtwork = this.mArtwork;
          const artworks = { newArtwork, ...this.mArtworks };

          this.$store.commit("setArtworksState", { artworks });

          // Upload image if one was selected
          if (this.image) {
            // eslint-disable-next-line
            console.log("Getting upload URL")

            this.uploadImage(newArtwork.artworkId);
          }

          // Redirect to artwork list view
          this.$router.push({ name: 'artworks'})
        } else {
          this.snack("error", response.message, this.notificationIcons.error);
        }
      } catch (err) {
        this.snack("error", err, this.notificationIcons.error);
      }
    },

    async uploadImage(artwork) {
      const args = {
        artwork
      };

      // Get presigned URL
      const response = await makeApiRequest(args, apiModel.Artwork.Upload, this.token, {});
      const uploadUrl = response.data.uploadUrl
      
      // eslint-disable-next-line
      console.log("Upload Url:", uploadUrl)

      axios.put(uploadUrl, this.image)
    },

    snack(color, err, icon) {
      this.color = color;
      this.snackbar = true;
      this.notificationMessage = err;
      this.notificationIcon = icon;
    }
  }
};
</script>

<style></style>
