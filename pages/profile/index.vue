<template>
  <div class="profile-page">
    <div class="user-info" v-if="profile">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="user.username === $route.params.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="editorProfile"
            >
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </button>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="clickFollow"
            >
              <i
                class="ion-plus-round"
                :class="{ active: profile.following }"
              ></i>
              &nbsp; {{ profile.following ? "Unfollow" : "Follow" }}
              {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: $route.query.tab !== 'favorites' }"
                  :to="{
                    path: `/profile/${$route.params.username}`,
                    query: {
                      tab: 'my',
                    },
                  }"
                  v-on:click.native="selectArticle"
                  exact
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: $route.query.tab === 'favorites' }"
                  :to="{
                    path: `/profile/${$route.params.username}`,
                    query: {
                      tab: 'favorites',
                    },
                  }"
                  v-on:click.native="selectArticle"
                  exact
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
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
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled || !user"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  v-for="item in article.tagList"
                  :key="item"
                  class="tag-default tag-pill tag-outline"
                >
                  {{ item }}
                </li>
              </ul>
            </nuxt-link>
          </div>
        </div>
      </div>
      <nav>
        <ul class="pagination">
          <li
            class="page-item"
            :class="{
              active: item === page,
            }"
            v-for="item in totalPage"
            :key="item"
          >
            <nuxt-link
              class="page-link ng-binding"
              :to="{
                name: 'home',
                query: {
                  page: item,
                  tag: $route.query.tag,
                  tab: tab,
                },
              }"
            >
              {{ item }}
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProfile, followUser, unFollowUser } from "@/api/profile";
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
export default {
  name: "ProfilePage",
  middleware: "authenticated",
  computed: {
    ...mapState(["user", "profile"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  data() {
    return {
      articles: "",
      page: 1,
      limit: 10,
      articlesCount: 0,
    };
  },
  async created() {
    if (this.user.username === this.$route.params.username) {
      this.$store.commit("setProfile", this.user);
    } else {
      const { data } = await getProfile(this.$route.params.username);
      this.$store.commit("setProfile", data.profile);
    }
    this.selectArticle();
  },
  watchQuery: ["page", "tab"],
  methods: {
    async selectArticle() {
      const tab = this.$route.query.tab || "my";
      const params =
        tab === "favorites"
          ? {
              favorited: this.$route.params.username,
              limit: this.limit,
              offset: (this.page - 1) * this.limit,
            }
          : {
              author: this.$route.params.username,
              limit: this.limit,
              offset: (this.page - 1) * this.limit,
            };
      const { data } = await getArticles(params);
      const { articles, articlesCount } = data;
      this.articles = articles;
      this.articlesCount = articlesCount;
    },
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
    async clickFollow() {
      if (this.profile.following) {
        await unFollowUser(this.profile.username);
      } else {
        await followUser(this.profile.username);
      }
    },
    editorProfile() {
      this.$router.push("/settings");
    },
  },
};
</script>

<style>
</style>