// similar products
const similarItems = (currentItem: any, allItems: any[]) => {
  const author = currentItem.data.author;

  // filter by author
  const filterByAuthor = allItems.filter(
    (item: any) => item.data.author === author
  );

  // filter by slug
  const filterBySlug = filterByAuthor.filter(
    (product) => product.slug !== currentItem.slug
  );

  // limit to 6 items
  return filterBySlug.slice(0, 6);
};

export default similarItems;
