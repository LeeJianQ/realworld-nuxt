const cookieparser = process.server ? require("cookieparser") : undefined;
import { addFavorite, deleteFavorite } from "@/api/article";
import { followUser, unFollowUser } from "@/api/profile";
export const state = () => {
  return {
    // 当前用户信息
    user: null,
    // 文章信息
    article: null,
    profile: null,
  };
};

export const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setArticle(state, article) {
    state.article = article;
  },
  setFollow(state, article) {
    article.author.following = !article.author.following;
    state.article = article;
  },
  setProfile(state, profile) {
    state.profile = profile;
  },
};

export const actions = {
  // 这是一个特殊的方法 这个action 会在服务端渲染期间自动调用，初始化容器的数据，传递数据给客户端调用
  nuxtServerInit({ commit }, { req }) {
    let user = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        user = JSON.parse(parsed.user);
      } catch (e) {}
    }
    commit("setUser", user);
  },
  async onFavorite({ commit }, article) {
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
    commit("setArticle", article);
  },
  async followProfile({ commit }, article) {
    if (article.author.following) {
      await unFollowUser(article.author.username);
    } else {
      await followUser(article.author.username);
    }
    commit("setFollow", article);
  },
};
