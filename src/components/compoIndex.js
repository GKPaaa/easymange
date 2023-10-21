import Left from './Left.vue';
import Header from './Header.vue';

export default {
    install: function (Vue, options) {
        Vue.component('Left', Left);
        Vue.component('Header', Header);
    }
}