import { RouteRecordRaw } from "vue-router";
import Home from '@pages/Home'
import Tip from "@pages/Tip";
import Setting from "@pages/Setting";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: Home
    }, {
        path: "/tip",
        component: Tip
    }, {
        path: "/setting",
        component: Setting,
    }
];

export default routes;
