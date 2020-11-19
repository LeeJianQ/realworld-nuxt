/**
 * 验证是否需要登录的中间件
 * @param {*} param0
 */
export default function({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user) {
    return redirect("/login");
  }
}