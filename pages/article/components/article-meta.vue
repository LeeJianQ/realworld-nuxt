<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
    </div>
    <template v-if="article.author.username !== user.username">
      <button
        class="btn btn-sm btn-outline-secondary"
        @click="followProfile(article)"
      >
        <i
          class="ion-plus-round"
          :class="{ active: article.author.following }"
        ></i>
        &nbsp; {{ article.author.following ? "Unfollow" : "Follow" }}
        {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary" @click="clickFavorite">
        <i class="ion-heart" :class="{ active: article.favorited }"></i>
        &nbsp; {{ article.favorited ? "Unfavorite" : "Favorite" }} Article
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
    <template v-else>
      <span class="ng-scope">
        <a class="btn btn-outline-secondary btn-sm" @click="editorArticle">
          <i class="ion-edit"></i> Edit Article
        </a>

        <button @click="removeArticle" class="btn btn-outline-danger btn-sm">
          <i class="ion-trash-a"></i> Delete Article
        </button>
      </span>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { deleteArticle } from "@/api/article";
export default {
  name: "ArticleMeta",
  computed: {
    ...mapState(["user", "article"]),
  },
  methods: {
    ...mapActions(["followProfile"]),
    clickFavorite() {
      this.$store.dispatch("onFavorite", this.article);
    },
    editorArticle() {
      window.sessionStorage.setItem("Article", JSON.stringify(this.article));
      this.$router.push({ name: "editor" });
    },
    async removeArticle() {
      await deleteArticle(this.article.slug);
      this.$router.push("/");
    },
  },
};
</script>

<style>
</style>