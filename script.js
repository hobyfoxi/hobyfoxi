document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('emailInput');
    const nameInput = document.getElementById('nameInput'); // Get name input if you have it
    const formMessage = document.getElementById('formMessage');

    // IMPORTANT: Replace this with the ACTUAL Form Action URL from your email service
    const FORM_ACTION_URL = 'YOUR_EMAIL_SERVICE_FORM_ACTION_URL_HERE';

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default page reload

        const email = emailInput.value.trim();
        const name = nameInput ? nameInput.value.trim() : ''; // Get name if field exists

        // Basic Client-Side Validation
        if (!email) {
            displayMessage('Please enter your email address.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            displayMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Prepare form data to send
        // This structure (FormData) is common for traditional form submissions
        // Some services might expect JSON if they have a specific API endpoint
        const formData = new FormData();
        formData.append(emailInput.name, email); // Uses the 'name' attribute from your HTML input

        if (nameInput && name) { // If you have a name field and it's filled
            formData.append(nameInput.name, name);
        }

        // Add any other hidden fields your email service might require
        // (check their embed code for inputs like <input type="hidden" name="list_id" value="123">)
        // For example: formData.append('mauticform[list_id_field_name]', 'YOUR_LIST_ID');


        // Display a "submitting..." message
        displayMessage('Submitting...', 'neutral'); // You might want a 'neutral' class for this
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';


        // Send data using Fetch API
        fetch(FORM_ACTION_URL, {
            method: 'POST',
            body: formData,
            // If your service's form endpoint expects JSON, you'd use:
            // headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ [emailInput.name]: email, /* other fields */ }),
            // Mode 'no-cors' can be a workaround for some CORS issues with simple form posts,
            // but you won't be able to read the response.
            // It's best if the server is configured for CORS.
            // mode: 'no-cors', // Try removing this first. Add if you get CORS errors AND can't read response.
        })
        .then(response => {
            // If mode: 'no-cors' is used, response.ok and response.status might not be reliable.
            // The request goes through, but the browser doesn't let JS see the details.
            // So, we often have to assume success if it doesn't throw an error.
            if (response.ok || response.type === 'opaque') { // Opaque response for no-cors
                displayMessage('Thanks for subscribing! Check your inbox for a confirmation email.', 'success');
                signupForm.reset(); // Clear the form
            } else {
                // Try to get more info if not an opaque response
                response.text().then(text => {
                    console.error('Submission error details:', text);
                    displayMessage(`Oops! Something went wrong. Server responded with ${response.status}. Please try again.`, 'error');
                });
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            displayMessage('Oops! Something went wrong. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Sign Me Up!';
        });
    });

    function isValidEmail(email) {
        // Basic regex for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function displayMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = 'form-message'; // Reset classes
        formMessage.classList.add(type); // Add 'success' or 'error'
        // If you add a 'neutral' class for "Submitting...", style it in CSS
        if (type === 'neutral') {
            formMessage.style.backgroundColor = '#e0e0e0'; // Example neutral style
            formMessage.style.color = '#333';
        }
    }
});
