<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tags"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="onSubmit"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticles } from "@/api/article";
export default {
  name: "EditorPage",
  middleware: "authenticated",
  data() {
    return {
      tags: "",
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
    };
  },
  created() {
    let article = JSON.parse(window.sessionStorage.getItem("Article"));
    this.article = article || this.article;
    this.tags = this.article.tagList.join(" ");
  },
  methods: {
    async onSubmit() {
      console.log(1234);
      if (this.tags) {
        this.article.tagList = this.tags.split(" ");
      }
      const { data } = await addArticles({ article: this.article });
      console.log(data);
      this.$router.push(`/article/${data.article.slug}`);
    },
  },
};
</script>

<style>
</style>