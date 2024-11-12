<template>
  <article>
    <my-header
      :user="user"
      @onLogin="onLogin"
      @onLogout="onLogout"
      @onCreateAccount="onCreateAccount"
    />
  </article>
</template>

<script>
import './page.css';
import MyHeader from './Header.vue';

export default {
  name: 'my-page',
  components: { MyHeader },

  data() {
    return {
      user: null,
    };
  },

  methods: {
    onLogin() {
      this.user = { name: 'Jane Doe' };
    },
    onLogout() {
      this.user = null;
    },
    onCreateAccount() {
      this.user = { name: 'Jane Doe' };
    },
  },
};
</script>
