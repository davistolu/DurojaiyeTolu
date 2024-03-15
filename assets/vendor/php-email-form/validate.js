(function () {
  "use strict";

  // Get all forms with class 'php-email-form'
  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault(); // Prevent default form submission behavior

      let action = form.getAttribute('action');
      let recaptchaSiteKey = form.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(form, 'The form action property is not set!');
        return;
      }

      let formData = new FormData(form); // Get form data

      if (recaptchaSiteKey) {
        executeRecaptcha(recaptchaSiteKey)
          .then(token => {
            formData.set('recaptcha-response', token);
            submitForm(form, action, formData);
          })
          .catch(error => {
            displayError(form, error);
          });
      } else {
        submitForm(form, action, formData);
      }
    });
  });

  // Function to execute reCaptcha
  function executeRecaptcha(siteKey) {
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha === "undefined") {
        reject('The reCaptcha javascript API is not loaded!');
      }

      grecaptcha.ready(function () {
        try {
          grecaptcha.execute(siteKey, { action: 'php_email_form_submit' })
            .then(token => {
              resolve(token);
            })
            .catch(error => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  // Function to submit form
  function submitForm(form, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        form.querySelector('.loading').classList.remove('d-block');
        if (data.trim() === 'OK') {
          form.querySelector('.sent-message').classList.add('d-block');
          form.reset();
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch(error => {
        displayError(form, error);
      });
  }

  // Function to display error
  function displayError(form, error) {
    form.querySelector('.loading').classList.remove('d-block');
    form.querySelector('.error-message').innerHTML = error;
    form.querySelector('.error-message').classList.add('d-block');
  }

})();
