import Vue from "vue";
import VueRouter from "vue-router";

import ArtworkList from "../views/Artworks/ArtworkList.vue";
import CreateArtwork from "../views/Artworks/CreateArtwork.vue";
import EditArtwork from "../views/Artworks/EditArtwork.vue";

import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "artworks",
    component: ArtworkList
  },
  {
    path: "/create",
    name: "create-artwork",
    component: CreateArtwork,
    beforeEnter: authGuard
  },
  {
    path: "/:artwork/edit",
    name: "edit-artwork",
    component: EditArtwork,
    beforeEnter: authGuard
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
