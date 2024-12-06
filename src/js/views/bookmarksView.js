// Importing the View class from the specified module
import View from './View.js';

// Importing the previewView module for rendering individual bookmarks
import previewView from './previewView.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the BookmarksView class, which extends the View class
class BookmarksView extends View {
  // Selecting the parent element for the bookmarks list
  _parentElement = document.querySelector('.bookmarks__list');

  // Defining an error message to display when there are no bookmarks
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it 🤗';

  // Defining a generic message (currently empty)
  _message = '';

  // Method to add an event listener to render bookmarks when the page loads
  addHandlerRender(handler) {
    window.addEventListener('load', handler); // Call the handler function on window load event
  }

  // Method to generate the markup for bookmarks
  _generateMarkup() {
    // Map over the data, render each bookmark using previewView, and join the result into a string
    return this._data
      .map(bookmark => previewView.render(bookmark, false)) // Render each bookmark without returning markup to the DOM
      .join(''); // Join all rendered bookmarks into a single string
  }
}

// Exporting an instance of the BookmarksView class as the default export
export default new BookmarksView();
