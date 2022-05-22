(async () => {
  const { query } = window.pokedex;

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

  const usernameField = document.querySelector('input[name=\'username\']');
  const passwordField = document.querySelector('input[name=\'password\']');
  const firstNameField = document.querySelector('input[name=\'first-name\']');
  const lastNameField = document.querySelector('input[name=\'last-name\']');
  const ageField = document.querySelector('input[name=\'age\']');
  const genderField = document.querySelector('select[name=\'gender\']');
  const alertDialogue = document.querySelector('p.form__alert');
  const registerBtn = document.querySelector('input[type=\'submit\']');
  let lastTimeout = null;

  registerBtn.onclick = e => {
    e.preventDefault();

    sendRegisterRequest({
      username: usernameField.value,
      password: passwordField.value,
      firstName: firstNameField.value,
      lastName: lastNameField.value,
      age: ageField.value,
      gender: genderField.value,
    })
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
