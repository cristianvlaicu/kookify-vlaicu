// Importing all exports from the model module
import * as model from './model.js';

// Importing constants and modules
import { MODAL_CLOSE_SEC } from './config.js'; // Time to close the modal automatically
import recipeView from './views/recipeView.js'; // View for displaying recipes
import searchView from './views/searchView.js'; // View for handling search functionality
import resultsView from './views/resultsView.js'; // View for displaying search results
import paginationView from './views/paginationView.js'; // View for pagination controls
import bookmarksView from './views/bookmarksView.js'; // View for managing bookmarks
import addRecipeView from './views/addRecipeView.js'; // View for adding new recipes

// Importing polyfills
import 'core-js/stable'; // Polyfills for modern JavaScript features
import 'regenerator-runtime/runtime'; // Polyfill for async/await
import { async } from 'regenerator-runtime'; // Explicit import of async (not directly used)

// Controller to manage recipe rendering
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // Get the recipe ID from the URL hash

    if (!id) return; // If no ID is present, exit the function
    recipeView.renderSpinner(); // Render a spinner while the recipe is loading

    // 0) Update results view to mark the selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Update bookmarks view to reflect changes
    bookmarksView.update(model.state.bookmarks);

    // 2) Load the recipe data
    await model.loadRecipe(id);

    // 3) Render the recipe to the UI
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError(); // Render an error message if something goes wrong
    console.error(err); // Log the error to the console
  }
};

// Controller to manage search results
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner(); // Render a spinner while search results are loading

    // 1) Get the search query from the search field
    const query = searchView.getQuery();
    if (!query) return; // Exit if no query is entered

    // 2) Load the search results
    await model.loadSearchResults(query);

    // 3) Render the search results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err); // Log any errors to the console
  }
};

// Controller to manage pagination
const controlPagination = function (goToPage) {
  // 1) Render new results for the specified page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination buttons
  paginationView.render(model.state.search);
};

// Controller to manage recipe servings
const controlServings = function (newServings) {
  // Update the servings in the state
  model.updateServings(newServings);

  // Update the recipe view with the new servings
  recipeView.update(model.state.recipe);
};

// Controller to manage bookmarks
const controlAddBookmark = function () {
  // 1) Add or remove a bookmark based on its current state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update the recipe view to reflect the bookmark status
  recipeView.update(model.state.recipe);

  // 3) Render the updated bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Controller to render bookmarks on page load
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks); // Render all saved bookmarks
};

// Controller to manage adding a new recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show a loading spinner while the recipe is being uploaded
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render the newly added recipe
    recipeView.render(model.state.recipe);

    // Display a success message
    addRecipeView.renderMessage();

    // Render the updated bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Update the URL with the new recipe ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the add recipe form after a delay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err); // Log the error
    addRecipeView.renderError(err.message); // Render an error message
  }
};

// Initialization function to set up event handlers
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // Handle rendering bookmarks on page load
  recipeView.addHandlerRender(controlRecipes); // Handle rendering recipes on hash change or page load
  recipeView.addHandlerUpdateServings(controlServings); // Handle servings updates
  recipeView.addHandlerAddBookmark(controlAddBookmark); // Handle adding/removing bookmarks
  searchView.addHandlerSearch(controlSearchResults); // Handle search functionality
  paginationView.addHandlerClick(controlPagination); // Handle pagination button clicks
  addRecipeView.addHandlerUpload(controlAddRecipe); // Handle adding a new recipe
};
init(); // Execute the initialization function
