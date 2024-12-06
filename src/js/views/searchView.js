// Defining the SearchView class
class SearchView {
  // Selecting the parent element for the search functionality
  _parentEl = document.querySelector('.search');

  // Method to get the search query from the input field
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; // Retrieve the value of the search input field
    this._clearInput(); // Clear the input field after getting the query
    return query; // Return the search query
  }

  // Private method to clear the input field
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = ''; // Set the value of the search input field to an empty string
  }

  // Method to add an event listener for the search functionality
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      // Add a submit event listener to the parent element
      e.preventDefault(); // Prevent the default form submission behavior
      handler(); // Call the handler function
    });
  }
}

// Exporting an instance of the SearchView class as the default export
export default new SearchView();
