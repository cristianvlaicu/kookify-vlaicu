// Importing the View class from the specified module
import View from './View.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the PreviewView class, which extends the View class
class PreviewView extends View {
  // Defining an empty parent element (to be specified later if needed)
  _parentElement = '';

  // Method to generate the markup for a preview item
  _generateMarkup() {
    const id = window.location.hash.slice(1); // Get the current hash from the URL (removing the '#' symbol)

    // Returning the HTML markup for a preview list item
    return `
      <li class="preview"> <!-- List item for the preview -->
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : '' // Add active class if the current item's ID matches the hash
        }" href="#${
      this._data.id
    }"> <!-- Link to the recipe with its ID in the hash -->
          <figure class="preview__fig"> <!-- Container for the image -->
            <img src="${this._data.image}" alt="${
      this._data.title
    }" /> <!-- Recipe image -->
          </figure>
          <div class="preview__data"> <!-- Container for the preview data -->
            <h4 class="preview__title">${
              this._data.title
            }</h4> <!-- Recipe title -->
            <p class="preview__publisher">${
              this._data.publisher
            }</p> <!-- Recipe publisher -->
            <div class="preview__user-generated ${
              this._data.key ? '' : 'hidden' // Show the user-generated icon only if `key` exists
            }">
              <svg> <!-- SVG icon for user-generated recipes -->
              <use href="${icons}#icon-user"></use> <!-- Use the user icon from the icons sprite -->
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }
}

// Exporting an instance of the PreviewView class as the default export
export default new PreviewView();
