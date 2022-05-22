(async () => {
  const { query } = window.pokedex;

  const sendRegisterRequest = (username, password) => query('/api/v2/user/register', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
    }),
  });

  const usernameField = document.querySelector('input[name=\'username\']');
  const passwordField = document.querySelector('input[name=\'password\']');
  const alertDialogue = document.querySelector('p.form__alert');
  const registerBtn = document.querySelector('input[type=\'submit\']');
  let lastTimeout = null;

  registerBtn.onclick = e => {
    e.preventDefault();

    sendRegisterRequest(usernameField.value, passwordField.value)
      .then(results => {
        if (!results.success) {
          clearTimeout(lastTimeout);
          alertDialogue.textContent = results.data.msg;
          alertDialogue.removeAttribute('data-hidden');

          lastTimeout = setTimeout(() => {
            alertDialogue.setAttribute('data-hidden', true);
          }, 3e3);
        } else {
          window.location.href = '/login';
        }
      });
  };
})();
