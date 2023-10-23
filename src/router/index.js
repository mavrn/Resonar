import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: () => import("../views/Results.vue") },
    { path: "/register", component: () => import("../views/Register.vue") },
    { path: "/release", component: () => import("../views/release.vue") },
    { path: "/sign-in", component: () => import("../views/SignIn.vue") },
    { path: "/user", component: () => import("../views/Profile.vue") },
  ],
});

export default router;
