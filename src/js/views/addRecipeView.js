// Importing the View class from the specified module
import View from './View.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the AddRecipeView class, which extends the View class
class AddRecipeView extends View {
  // Selecting the parent element for the upload form
  _parentElement = document.querySelector('.upload');

  // Defining a message to display when a recipe is successfully uploaded
  _message = 'Recipe was successfully uploaded 😀';

  // Selecting various DOM elements for modal window and overlay functionality
  _window = document.querySelector('.add-recipe-window'); // Modal window
  _overlay = document.querySelector('.overlay'); // Overlay element
  _btnOpen = document.querySelector('.nav__btn--add-recipe'); // Button to open modal
  _btnClose = document.querySelector('.btn--close-modal'); // Button to close modal

  // Constructor to initialize event handlers and call the parent class's constructor
  constructor() {
    super(); // Call the parent class constructor
    this._addHandlerShowWindow(); // Add event handler to show modal window
    this._addHandlerHideWindow(); // Add event handler to hide modal window
  }

  // Method to toggle visibility of modal window and overlay
  toggleWindow() {
    this._overlay.classList.toggle('hidden'); // Toggle 'hidden' class on overlay
    this._window.classList.toggle('hidden'); // Toggle 'hidden' class on modal window
  }

  // Private method to add an event listener for showing the modal window
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // Bind toggleWindow method to the button
  }

  // Private method to add event listeners for hiding the modal window
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // Bind toggleWindow method to close button
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // Bind toggleWindow method to overlay
  }

  // Method to handle the upload event
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Add submit event listener to the form
      e.preventDefault(); // Prevent default form submission behavior
      const dataArr = [...new FormData(this)]; // Create an array from form data
      const data = Object.fromEntries(dataArr); // Convert the array to an object
      handler(data); // Call the handler function with the form data
    });
  }

  // Placeholder method to generate markup (currently empty)
  _generateMarkup() {}
}

// Exporting an instance of the AddRecipeView class as the default export
export default new AddRecipeView();
