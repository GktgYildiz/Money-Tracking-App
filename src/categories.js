let categories = [{ id: 1, name: "salary" }];

export const fetchCategories = () => {
  return categories;
};

export const addCategory = (category) => {
  const newCategory = {
    id: categories.length + 1,
    name: category,
  };
  categories = [...categories, newCategory];
  return newCategory;
};

export const validateCategory = (categoryId) => {
  return categories.find((category) => category.id === categoryId);
};

export default { fetchCategories, addCategory, validateCategory };
