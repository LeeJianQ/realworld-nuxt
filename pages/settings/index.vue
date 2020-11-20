<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="updateUserInfo">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="userInfo.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="userInfo.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { updateUser } from "@/api/user";
export default {
  name: "SettingsPage",
  middleware: "authenticated",
  computed: {
    ...mapState(["user"]),
  },
  data() {
    return {
      userInfo: "",
    };
  },
  created() {
    this.userInfo = { password: null, ...this.user };
  },
  methods: {
    async updateUserInfo() {
      const user = this.userInfo.password
        ? {
            email: this.userInfo.email,
            username: this.userInfo.username,
            password: this.userInfo.password,
            image: this.userInfo.image,
            bio: this.userInfo.bio,
          }
        : {
            email: this.userInfo.email,
            username: this.userInfo.username,
            image: this.userInfo.image,
            bio: this.userInfo.bio,
          };
      const { data } = await updateUser({
        user: user,
      });
      console.log(data);
      this.$store.commit("setUser", data.user);
      this.$router.push({
        name: "profile",
        params: { username: data.user.username },
      });
    },
  },
};
</script>

<style>
</style>