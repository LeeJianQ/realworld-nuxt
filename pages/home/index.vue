<template>
  <div>
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <!-- 标签 -->
            <div class="feed-toggle">
              <ul class="nav nav-pills outline-active">
                <li v-if="user" class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{ active: tab === 'your_feed' }"
                    :to="{ name: 'home', query: { tab: 'your_feed' } }"
                    exact
                    >Your Feed</nuxt-link
                  >
                </li>
                <li class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{ active: tab === 'global_feed' }"
                    :to="{ name: 'home', query: { tab: 'global_feed' } }"
                    exact
                    >Global Feed</nuxt-link
                  >
                </li>
                <li v-if="tag" class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{ active: tab === 'tag' }"
                    :to="{ name: 'home', query: { tab: 'tab', tag: tag } }"
                    >#{{ tag }}</nuxt-link
                  >
                </li>
              </ul>
            </div>
            <!-- 标签 -->

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

            <!-- 分页内容 -->
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
            <!-- /分页内容 -->
          </div>
          <!-- 标签列表 -->
          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>

              <div class="tag-list">
                <nuxt-link
                  v-for="item in tags"
                  :key="item"
                  :to="{
                    name: 'home',
                    query: {
                      tag: item,
                      tab: 'tag',
                    },
                  }"
                  class="tag-pill tag-default"
                >
                  {{ item }}
                </nuxt-link>
              </div>
            </div>
          </div>
          <!-- 标签列表 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getTags } from "@/api/tag";
import {
  getArticles,
  getArticlesFeed,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
export default {
  name: "HomePage",
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { tag } = query;
    const tab = query.tab || "global_feed";
    const loadArticles = tab !== "your_feed" ? getArticles : getArticlesFeed;
    const [articleList, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);
    // console.log(data);
    // cons
    const { tags } = tagRes.data;
    const { articles, articlesCount } = articleList.data;
    articles.forEach((article) => (article.favoriteDisabled = false));
    return {
      tab,
      tag,
      tags,
      articles,
      articlesCount,
      limit,
      page,
    };
  },
  watchQuery: ["page", "tag", "tab"],
  methods: {
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
  },
  head() {
    return {
      title: `RealWorld-Home`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "home",
          content: "realworld",
        },
      ],
    };
  },
};
</script>

<style>
</style>