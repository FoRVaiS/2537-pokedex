(async () => {
  const { query, getRequiredValueFrom } = window.pokedex;

  const sendRegisterRequest = ({ username, password, firstName, lastName, age, gender }) => query('/api/v2/user/register', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age,
      gender: gender.trim(),
    }),
  });

  const alertDialogue = document.querySelector('p.form__alert');
  const registerBtn = document.querySelector('input[type=\'submit\']');
  let lastTimeout = null;

  registerBtn.onclick = e => {
    e.preventDefault();

    const username = getRequiredValueFrom('input[name=\'username\']', String);
    const password = getRequiredValueFrom('input[name=\'password\']', String);
    const firstName = getRequiredValueFrom('input[name=\'first-name\']', String);
    const lastName = getRequiredValueFrom('input[name=\'last-name\']', String);
    const age = getRequiredValueFrom('input[name=\'age\']', Number);
    const gender = getRequiredValueFrom('select[name=\'gender\']', String);

    if ([username, password, firstName, lastName, age, gender].includes(null)) return null;

    return sendRegisterRequest({ username, password, firstName, lastName, age, gender })
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
