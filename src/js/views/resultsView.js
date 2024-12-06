// Importing the View class from the specified module
import View from './View.js';

// Importing the previewView module for rendering individual results
import previewView from './previewView.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the ResultsView class, which extends the View class
class ResultsView extends View {
  // Selecting the parent element for the search results
  _parentElement = document.querySelector('.results');

  // Defining an error message to display when no recipes are found
  _errorMessage = 'No recipes found for your search! Please try again 🙏';

  // Defining a generic message (currently empty)
  _message = '';

  // Method to generate the markup for the search results
  _generateMarkup() {
    // Map over the data, render each result using previewView, and join the result into a single string
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// Exporting an instance of the ResultsView class as the default export
export default new ResultsView();
