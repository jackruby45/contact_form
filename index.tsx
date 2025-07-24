/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const form = document.getElementById('contact-form') as HTMLFormElement;
const successMessage = document.getElementById('success-message') as HTMLParagraphElement;
const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;


if (form && successMessage && errorMessage && submitButton) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Reset messages and set loading state on button
    submitButton.disabled = true;
    submitButton.textContent = 'Saving...';
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    const formData = new FormData(form);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // On successful upload
        successMessage.style.display = 'block';
        form.reset();
        // Hide the success message after 5 seconds
        setTimeout(() => {
          if (successMessage) {
              successMessage.style.display = 'none';
          }
        }, 5000);
      } else {
        // On failed upload, show error from server
        const errorData = await response.json();
        errorMessage.textContent = errorData.error || 'An unknown error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      // On network or other client-side errors
      console.error('Form submission failed:', error);
      errorMessage.textContent = 'Submission failed. Please check your network connection.';
      errorMessage.style.display = 'block';
    } finally {
      // Re-enable the button
      submitButton.disabled = false;
      submitButton.textContent = 'Save';
    }
  });
}