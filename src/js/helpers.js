// Importing the `async` utility from the regenerator-runtime library
import { async } from 'regenerator-runtime';

// Importing the timeout constant from the config module
import { TIMEOUT_SEC } from './config.js'; // Maximum time to wait for a request before timing out

// Function to create a timeout promise
const timeout = function (s) {
  return new Promise(function (_, reject) {
    // Create a promise that automatically rejects after `s` seconds
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`)); // Reject with an error message
    }, s * 1000); // Convert seconds to milliseconds
  });
};

// Function to handle both GET and POST AJAX requests
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Create a fetch promise based on whether uploadData is provided
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST', // Use the POST method for sending data
          headers: {
            'Content-Type': 'application/json', // Specify JSON content type
          },
          body: JSON.stringify(uploadData), // Convert the upload data to a JSON string
        })
      : fetch(url); // Use the GET method if no data is provided

    // Wait for the fastest promise between the fetch and the timeout
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // Abort if the request takes longer than TIMEOUT_SEC
    const data = await res.json(); // Parse the response as JSON

    // Throw an error if the response is not OK
    if (!res.ok) throw new Error(`${data.message} (${res.status})`); // Include the API error message and status code
    return data; // Return the parsed data
  } catch (err) {
    throw err; // Re-throw the error to be handled by the caller
  }
};
