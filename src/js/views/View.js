// Importing icons with Parcel 2 URL handling
import icons from 'url:../../img/icons.svg'; // Parcel 2

// Defining the View class to manage rendering and updating the DOM
export default class View {
  _data; // Placeholder for the data to be rendered

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Cristian Vlaicu Solomon
   * @todo Finish implementation
   */

  // Method to render data to the DOM
  render(data, render = true) {
    // Check if the data is invalid or empty and render an error if so
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data; // Save the data to the instance
    const markup = this._generateMarkup(); // Generate the HTML markup for the data

    if (!render) return markup; // If render is false, return the markup as a string

    this._clear(); // Clear the parent element's content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the new markup into the DOM
  }

  // Method to update the DOM elements with new data without re-rendering everything
  update(data) {
    this._data = data; // Update the instance with the new data
    const newMarkup = this._generateMarkup(); // Generate the new markup

    const newDOM = document.createRange().createContextualFragment(newMarkup); // Create a virtual DOM from the markup
    const newElements = Array.from(newDOM.querySelectorAll('*')); // Select all elements from the virtual DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // Select all elements from the current DOM

    // Loop through the elements to update only those that have changed
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i]; // Get the corresponding current DOM element

      // Update text content if it has changed
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Update attributes if they have changed
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  // Private method to clear the content of the parent element
  _clear() {
    this._parentElement.innerHTML = ''; // Remove all inner HTML of the parent element
  }

  // Method to render a spinner while data is being loaded
  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use> <!-- Use the loader icon -->
        </svg>
      </div>
    `;
    this._clear(); // Clear the parent element's content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the spinner into the DOM
  }

  // Method to render an error message
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use> <!-- Use the alert triangle icon -->
          </svg>
        </div>
        <p>${message}</p> <!-- Display the error message -->
      </div>
    `;
    this._clear(); // Clear the parent element's content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the error message into the DOM
  }

  // Method to render a success or information message
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use> <!-- Use the smile icon -->
          </svg>
        </div>
        <p>${message}</p> <!-- Display the message -->
      </div>
    `;
    this._clear(); // Clear the parent element's content
    this._parentElement.insertAdjacentHTML('afterbegin', markup); // Insert the message into the DOM
  }
}
