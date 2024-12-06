// Importing the View class from the specified module
import View from './View.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Importing the `fracty` library for formatting fractions
// @ts-ignore
const fracty = require('../../../node_modules/fracty');

// Defining the RecipeView class, which extends the View class
class RecipeView extends View {
  // Selecting the parent element for the recipe
  _parentElement = document.querySelector('.recipe');

  // Defining an error message to display when a recipe is not found
  _errorMessage = 'We could not find that recipe. Please try another one!';

  // Defining a generic message (currently empty)
  _message = '';

  // Method to add event listeners for rendering a recipe on hash change or page load
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler)); // Add handler for both hash change and page load
  }

  // Method to add event listeners for updating the servings
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings'); // Find the closest servings update button
      if (!btn) return; // Exit if no button is clicked
      const { updateTo } = btn.dataset; // Get the `data-update-to` value
      if (+updateTo > 0) handler(+updateTo); // Call the handler function with the new servings value if valid
    });
  }

  // Method to add an event listener for adding a bookmark
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark'); // Find the closest bookmark button
      if (!btn) return; // Exit if no button is clicked
      handler(); // Call the handler function
    });
  }

  // Method to generate the markup for a recipe
  _generateMarkup() {
    return `
      <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings - 1
            }">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to="${
              this._data.servings + 1
            }">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(this._generateMarkupIngredient)
            .join('')} <!-- Generate markup for each ingredient -->
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  // Method to generate markup for a single ingredient
  _generateMarkupIngredient(ing) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? fracty(ing.quantity).toString() : '' // Format the quantity using fracty or leave blank if null
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span> <!-- Display the unit -->
        ${ing.description} <!-- Display the ingredient description -->
      </div>
    </li>
  `;
  }
}

// Exporting an instance of the RecipeView class as the default export
export default new RecipeView();
