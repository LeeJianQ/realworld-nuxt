<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article"></article-meta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div v-html="article.renderBody"></div>
          <ul class="tag-list">
            <li
              v-for="item in article.tagList"
              :key="item"
              class="tag-default tag-pill tag-outline"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <article-meta :article="article"></article-meta>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <article-comment :article="article"></article-comment>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getArticle, addFavorite, deleteFavorite } from "@/api/article";
import MarkdownIt from "markdown-it";
import ArticleMeta from "./components/article-meta";
import ArticleComment from "./components/article-comment";
export default {
  name: "ArticlePage",
  async asyncData({ params, store }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.renderBody = md.render(article.body);
    article.favoriteDisabled = false;
    store.commit("setArticle", article);
    // return {
    //   article,
    // };
  },
  computed: {
    ...mapState(["article"]),
  },
  components: {
    ArticleMeta,
    ArticleComment,
  },
  head() {
    return {
      title: `RealWorld-${this.article.title}`,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: this.article.title,
          content: this.article.description,
        },
      ],
    };
  },
};
</script>

<style>
</style>