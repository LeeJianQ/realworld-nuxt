import { request } from "@/plugins/request";

// 获取 tag 列表 /api/tags
export const getTags = () => {
  return request({
    method: "GET",
    url: "/api/tags",
  });
};
