(async () => {
  const { query, getRequiredValueFrom } = window.pokedex;

  const sendLoginRequest = (username, password) => query('/api/v2/user/login', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password.trim(),
    }),
  });

  const alertDialogue = document.querySelector('p.form__alert');
  const loginBtn = document.querySelector('input[type=\'submit\']');
  let lastTimeout = null;

  loginBtn.onclick = e => {
    e.preventDefault();

    const username = getRequiredValueFrom('input[name=\'username\']', String);
    const password = getRequiredValueFrom('input[name=\'password\']', String);

    if (username === null || password === null) return null;

    return sendLoginRequest(username, password)
      .then(results => {
        if (!results.success) {
          clearTimeout(lastTimeout);
          alertDialogue.textContent = results.data.msg;
          alertDialogue.removeAttribute('data-hidden');

          lastTimeout = setTimeout(() => {
            alertDialogue.setAttribute('data-hidden', true);
          }, 3e3);
        } else {
          window.location.href = '/';
        }
      });
  };
})();
