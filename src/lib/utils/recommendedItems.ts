// 推荐文章
const recommendedItems = (allPosts: any[]) => {
  // 过滤推荐文章
  const recommendedPosts = allPosts
    .filter((post) => post.data.is_recommended)
    .sort((a, b) => new Date(b.data.last_updated).getTime() - new Date(a.data.last_updated).getTime());

  return recommendedPosts;
};

export default recommendedItems; 