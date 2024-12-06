// 推荐模型
const recommendedItems = (allPosts: any[]) => {
  // 过滤推荐模型
  const recommendedPosts = allPosts
    .filter((post) => post.data.is_recommended && post.data.is_active)
    .sort((a, b) => new Date(b.data.last_updated).getTime() - new Date(a.data.last_updated).getTime());

  return recommendedPosts;
};

// 免费模型
export const freeItems = (allPosts: any[]) => {
  const freePosts = allPosts.filter((post) => post.data.is_free && post.data.is_active);
  return freePosts;
};

// 打折模型
export const discountItems = (allPosts: any[]) => {
  const discountPosts = allPosts.filter((post) => post.data.discount < 1 && post.data.is_active);
  return discountPosts;
};

export default recommendedItems; 