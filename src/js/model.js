// Importing the `async` utility from the regenerator-runtime library
import { async } from 'regenerator-runtime';

// Importing configuration constants and helper functions
import { API_URL, RES_PER_PAGE, KEY } from './config.js'; // API URL, results per page, and API key
import { AJAX } from './helpers.js'; // Utility function for handling AJAX requests

// Defining the global state object to store application data
export const state = {
  recipe: {}, // Current recipe details
  search: {
    query: '', // Search query string
    results: [], // Array of search results
    page: 1, // Current search results page
    resultsPerPage: RES_PER_PAGE, // Number of results per page
  },
  bookmarks: [], // Array of bookmarked recipes
};

// Function to create a standardized recipe object from the API response
const createRecipeObject = function (data) {
  const { recipe } = data.data; // Extract the recipe data from the response
  return {
    id: recipe.id, // Recipe ID
    title: recipe.title, // Recipe title
    publisher: recipe.publisher, // Publisher name
    sourceUrl: recipe.source_url, // Source URL
    image: recipe.image_url, // Image URL
    servings: recipe.servings, // Number of servings
    cookingTime: recipe.cooking_time, // Cooking time in minutes
    ingredients: recipe.ingredients, // Array of ingredients
    ...(recipe.key && { key: recipe.key }), // API key if available
  };
};

// Function to load a recipe by ID
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`); // Fetch the recipe data from the API
    state.recipe = createRecipeObject(data); // Standardize the recipe data

    // Check if the recipe is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe); // Log the recipe data
  } catch (err) {
    console.error(`${err} 💥💥💥💥`); // Log the error
    throw err; // Re-throw the error
  }
};

// Function to load search results based on a query
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query; // Save the query in the state

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); // Fetch search results from the API
    console.log(data); // Log the data

    // Map the results to a standardized format
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id, // Recipe ID
        title: rec.title, // Recipe title
        publisher: rec.publisher, // Publisher name
        image: rec.image_url, // Image URL
        ...(rec.key && { key: rec.key }), // API key if available
      };
    });
    state.search.page = 1; // Reset to the first page
  } catch (err) {
    console.error(`${err} 💥💥💥💥`); // Log the error
    throw err; // Re-throw the error
  }
};

// Function to get search results for a specific page
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; // Update the current page in the state

  const start = (page - 1) * state.search.resultsPerPage; // Calculate the start index
  const end = page * state.search.resultsPerPage; // Calculate the end index

  return state.search.results.slice(start, end); // Return the results for the specified page
};

// Function to update the servings in a recipe
export const updateServings = function (newServings) {
  // Update the quantity of each ingredient
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings; // Update the servings in the state
};

// Function to persist bookmarks to localStorage
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks)); // Save bookmarks as a JSON string
};

// Function to add a recipe to bookmarks
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe); // Add the recipe to bookmarks

  // Mark the current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks(); // Save bookmarks to localStorage
};

// Function to delete a bookmark by ID
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id); // Find the index of the bookmark
  state.bookmarks.splice(index, 1); // Remove the bookmark from the array

  // Mark the current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks(); // Save bookmarks to localStorage
};

// Initialization function to load bookmarks from localStorage
const init = function () {
  const storage = localStorage.getItem('bookmarks'); // Get bookmarks from localStorage
  if (storage) state.bookmarks = JSON.parse(storage); // Parse and save to state if available
};
init(); // Execute the initialization function

// Function to upload a new recipe to the API
export const uploadRecipe = async function (newRecipe) {
  try {
    // Extract and validate ingredients from the input data
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim()); // Split and trim each ingredient
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format 🤗'
          );

        const [quantity, unit, description] = ingArr; // Destructure the ingredient
        return { quantity: quantity ? +quantity : null, unit, description }; // Return a standardized ingredient object
      });

    // Create a recipe object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // Upload the recipe to the API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data); // Standardize and save the recipe to state
    addBookmark(state.recipe); // Automatically bookmark the uploaded recipe
  } catch (err) {
    throw err; // Re-throw the error
  }
};
