import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

import 'core-js/stable'; //To support old browsers
import 'regenerator-runtime/runtime'; //Polyfilling asunc/await

// https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<a7e23780-2954-4f4b-ba66-44ed96313cc7>

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 0) update results view to mark selected search result active
    resultsView.update(model.getSearchResultPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookMarks);

    // 2) load recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);

    // controlServing();
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
    // bookmarksView.update(model.);

    //Render Pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError();
  }
};
// controlSearchResults();

const controlPagination = function (gotoPage) {
  //Render new Results
  resultsView.render(model.getSearchResultPage(gotoPage));

  //Render new Pagination
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //update the recipe serving
  model.updateServings(newServings);

  //update the render view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add or delete bookmark in array
  if (!model.state.recipe.bookMarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //Update recipeView
  recipeView.update(model.state.recipe);

  //Render the bookmarks
  bookmarksView.render(model.state.bookMarks);
};

const controlBoolmarks = function () {
  bookmarksView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Success Message
    addRecipeView.renderMessage();

    //Close form window
    setTimeout(() => addRecipeView.toggleWindow(), MODEL_CLOSE_SEC * 1000);

    //Render the bookmarks
    bookmarksView.render(model.state.bookMarks);

    //change id in the hash
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => location.reload(), MODEL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error);
  }
};
function init() {
  bookmarksView.addHandlerRender(controlBoolmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();
