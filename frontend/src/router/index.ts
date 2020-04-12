import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Home from "../views/Home.vue"
import Start from "../views/Start.vue"
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/start",
        name: "Start",
        component: Start,
    },
    {
        path: "/login",
        name: "Home",
        component: Login,
    },
    {
        path: "/register",
        name: "Home",
        component: Register,
    },
    // {
    //     path: "/about",
    //     name: "About",
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
    // },
]

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
})

export default router
