import { request } from "@/plugins/request";

// 获取用户信息 /api/profiles/:username
export const getProfile = (username) => {
  return request({
    url: `/api/profiles/${username}`,
    method: "GET",
  });
};

// 关注用户 /api/profiles/:username/follow
export const followUser = (username) => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: "POST",
  });
};

// 取消关注 /api/profiles/:username/follow
export const unFollowUser = (username) => {
  return request({
    url: `/api/profiles/${username}/follow`,
    method: "DELETE",
  });
};
