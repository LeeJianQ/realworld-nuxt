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
