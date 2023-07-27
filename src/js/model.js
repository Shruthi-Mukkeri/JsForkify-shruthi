import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookMarks: [],
};

const createRecipeObject = function (res) {
  let { recipe } = res.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    publisher: recipe.publisher,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const res = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(res);
    if (state.bookMarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookMarked = true;
    } else {
      state.recipe.bookMarked = false;
    }
  } catch (err) {
    console.log(`${err}💥💥💥`);
    throw err;
  }
};

export const loadRecipeSearch = async function (query) {
  try {
    state.search.query = query;
    const res = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = res.data.recipes.map(res => {
      return {
        id: res.id,
        publisher: res.publisher,
        image: res.image_url,
        title: res.title,
        ...(res.key && { key: res.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    // console.log(`${err}💥💥💥`);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  if (!state.recipe) return;
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServing / oldServing
  });
  state.recipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookMarks));
};

export const addBookmark = function (recipe) {
  //Add bookmark
  state.bookMarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookMarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  //Delete bookmark
  const index = state.bookMarks.findIndex(el => el.id === id);
  state.bookMarks.splice(index, 1);
  console.log(index, 'deleted');
  //Mark current recipe NOT  bookmark
  if (id === state.recipe.id) state.recipe.bookMarked = false;
  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        console.log(ingArr);
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient formate.Please use the correct formate'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookMarks = JSON.parse(storage);
};
init();
