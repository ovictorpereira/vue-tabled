import VueTabled from "./components/VueTabled.vue";

export default {
    install: (app, options) => {
        app.component("VueTabled", VueTabled);
    },
};