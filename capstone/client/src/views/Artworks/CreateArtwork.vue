<template>
  <v-container>
    <v-form ref="form" v-model="valid">
      <v-text-field
        v-model="title"
        :rules="titleRules"
        label="Title"
        required
      ></v-text-field>

      <v-textarea
        solo
        v-model="description"
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
        @click="createArtwork"
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
  name: "CreateArtwork",

  computed: {
    ...mapGetters(["artworks"]),

    mArtworks: function() {
      return this.artworks;
    }
  },

  data() {
    return {
      valid: true,
      token: null,
      title: "",
      titleRules: [v => !!v || "Title is required"],
      description: "",
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
    async createArtwork() {
      try {
        const tokenObj = await this.$auth.getIdTokenClaims();
        const token = tokenObj.__raw;
        this.token = token;

        const args = {
          title: this.title,
          description: this.description
        };

        const response = await makeApiRequest(
          args,
          apiModel.Artwork.Create,
          token,
          {}
        );

        const status = response.status;

        if (status === 201) {
          // Set artworks state via mutations
          const newArtwork = response.data.newItem;
          const artworks = { newArtwork, ...this.mArtworks };

          this.$store.commit("setArtworksState", { artworks });

          // Upload image if one was selected
          if (this.image) {
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
