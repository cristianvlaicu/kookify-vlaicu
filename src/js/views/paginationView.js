// Importing the View class from the specified module
import View from './View.js';

// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the PaginationView class, which extends the View class
class PaginationView extends View {
  // Selecting the parent element for the pagination controls
  _parentElement = document.querySelector('.pagination');

  // Method to add a click event listener to the pagination buttons
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // Add event listener to the pagination container
      const btn = e.target.closest('.btn--inline'); // Find the closest button element with the class 'btn--inline'
      if (!btn) return; // If no button is clicked, exit the function

      const goToPage = +btn.dataset.goto; // Retrieve the page number from the button's dataset
      handler(goToPage); // Call the handler function with the page number
    });
  }

  // Method to generate the markup for pagination controls
  _generateMarkup() {
    const curPage = this._data.page; // Get the current page number from the data
    const numPages = Math.ceil(
      // Calculate the total number of pages
      this._data.results.length / this._data.resultsPerPage // Total results divided by results per page
    );

    // Markup for the "next" button
    const _nextPage = `<button data-goto="${
      curPage + 1 // Set the page number for the next page
    }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span> <!-- Display the next page number -->
          <svg class="search__icon"> <!-- Icon for the button -->
            <use href="${icons}#icon-arrow-right"></use> <!-- Use the right arrow icon -->
          </svg>
        </button>`;

    // Markup for the "previous" button
    const _prevPage = `
        <button data-goto="${
          curPage - 1 // Set the page number for the previous page
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon"> <!-- Icon for the button -->
            <use href="${icons}#icon-arrow-left"></use> <!-- Use the left arrow icon -->
          </svg>
          <span>Page ${
            curPage - 1
          }</span> <!-- Display the previous page number -->
        </button>
      `;

    const currentPageMarkup = `
    <span class="pagination__current-page"> ${curPage} of ${numPages}</span>
`;

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `${currentPageMarkup} ${_nextPage}`; // Only show the "next" button
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return `${_prevPage} ${currentPageMarkup}`; // Only show the "previous" button
    }

    // Other page
    if (curPage < numPages) {
      return `${_prevPage} ${currentPageMarkup} ${_nextPage}`; // Show both "previous" and "next" buttons
    }

    // Page 1, and there are NO other pages
    return ''; // Return an empty string if there are no pagination controls
  }
}

// Exporting an instance of the PaginationView class as the default export
export default new PaginationView();
