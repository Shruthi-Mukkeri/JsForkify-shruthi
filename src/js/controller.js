import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; //To support old browsers
import 'regenerator-runtime/runtime'; //Polyfilling asunc/await

// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<a7e23780-2954-4f4b-ba66-44ed96313cc7>

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    //load recipe
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
// controlRecipe();

const controlSearchResults = async function () {
  try {
    //Get Search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    //Search results
    await model.loadRecipeSearch(query);

    //Render Results
    resultsView.render(model.getSearchResultPage());

    //Render Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};
// controlSearchResults();

const controlPagination = function (gotoPage) {
  //Render new Results
  resultsView.render(model.getSearchResultPage(gotoPage));

  //Render new Pagination
  paginationView.render(model.state.search);
  console.log();
};

function init() {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
}
init();
