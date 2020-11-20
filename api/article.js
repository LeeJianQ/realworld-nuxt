import { request } from "@/plugins/request";

// 获取文章列表 /api/articles
export const getArticles = (params) => {
  return request({
    url: "/api/articles",
    method: "GET",
    params,
  });
};

// 获取自己的文章列表
export const getArticlesFeed = (params) => {
  return request({
    url: "/api/articles/feed",
    method: "GET",
    params,
  });
};

// 给文章点赞  /api/articles/:slug/favorite
export const addFavorite = (slug) => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: "POST",
  });
};

// 取消点赞 /api/articles/:slug/favorite
export const deleteFavorite = (slug) => {
  return request({
    url: `/api/articles/${slug}/favorite`,
    method: "DELETE",
  });
};

// 获取当前文章详情 /api/articles/:slug
export const getArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}`,
    method: "GET",
  });
};

// 发布文章 /api/articles
export const addArticles = (data) => {
  return request({
    url: "/api/articles",
    method: "POST",
    data,
  });
};

export const deleteArticle = (slug) => {
  return request({
    url: `/api/articles/${slug}`,
    method: "DELETE",
  });
};

// 添加评论 /api/articles/:slug/comments
export const addComment = (data, slug) => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: "POST",
    data,
  });
};

// 获取评论 /api/articles/:slug/comments
export const getComments = (slug) => {
  return request({
    url: `/api/articles/${slug}/comments`,
    method: "GET",
  });
};

// 删除评论 /api/articles/:slug/comments/:id
export const deleteComment = (id, slug) => {
  return request({
    url: `/api/articles/${slug}/comments/${id}`,
    method: "DELETE",
  });
};
