<template>
  <div>
    <form @submit.prevent="pushComment" class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment.body"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div v-for="(msg, key) in comments" :key="key" class="card">
      <div class="card-block">
        <p class="card-text">
          {{ msg.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="'/profile/' + msg.author.username"
          class="comment-author"
        >
          <img :src="msg.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="'/profile/' + msg.author.username"
          class="comment-author"
          >{{ msg.author.username }}</nuxt-link
        >
        <span class="date-posted">{{
          msg.createdAt | date("MMM DD, YYYY")
        }}</span>
        <span class="mod-options" v-if="msg.author.username === user.username">
          <!-- <i class="ion-edit"></i> -->
          <i @click="removeComment(msg, key)" class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { addComment, getComments, deleteComment } from "@/api/article";
export default {
  name: "ArticleComment",
  computed: {
    ...mapState(["user"]),
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      comment: {
        body: "",
      },
    };
  },
  async created() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods: {
    async pushComment() {
      const { data } = await addComment(
        { comment: this.comment },
        this.article.slug
      );
      const { comment } = data;
      this.comments.push(comment);
    },
    async removeComment(item, key) {
      const { data } = await deleteComment(item.id, this.article.slug);
      this.comments.splice(key, 1);
    },
  },
};
</script>

<style>
</style>