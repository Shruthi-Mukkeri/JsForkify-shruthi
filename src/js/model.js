import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
};

export const loadRecipe = async function (id) {
  try {
    const res = await getJSON(`${API_URL}/${id}`);
    let { recipe } = res.data;
    state.recipe = {
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      title: recipe.title,
      publisher: recipe.publisher,
      servings: recipe.serving,
      ingredients: recipe.ingredients,
    };
  } catch (err) {
    // console.log(`${err}💥💥💥`);
    throw err;
  }
};

export const loadRecipeSearch = async function (query) {
  try {
    state.search.query = query;
    const res = await getJSON(`${API_URL}?search=${query}`);
    state.search.results = res.data.recipes.map(res => {
      return {
        id: res.id,
        publisher: res.publisher,
        image: res.image_url,
        title: res.title,
      };
    });
  } catch (err) {
    console.log(`${err}💥💥💥`);
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  console.log(page, 'curPage');
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  // console.log(page, start, end);
  // console.log(state.search.results);
  return state.search.results.slice(start, end);
};
