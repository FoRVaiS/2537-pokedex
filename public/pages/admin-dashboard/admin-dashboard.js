(() => {
  const { query, getRequiredValueFrom } = window.pokedex;

  const handleEdit = id => window.location.href = `/dashboard?id=${id}`;

  const handleEditSubmit = async e => {
    e.preventDefault();
    
    const username = getRequiredValueFrom('input[name=\'username\']', String);
    const password = getRequiredValueFrom('input[name=\'password\']', String);
    const firstName = getRequiredValueFrom('input[name=\'first-name\']', String);
    const lastName = getRequiredValueFrom('input[name=\'last-name\']', String);

    if ([username, password, firstName, lastName].includes(null)) return null;

    const { success } = await query('/user/edit', { username, password, firstName, lastName });

    if (success) window.location.href = '/dashboard';
  };

  const userEditBtns = document.querySelectorAll('.in-edit');
  userEditBtns.forEach(editBtn => {
    editBtn.addEventListener('click', handleEdit.bind(null, editBtn.getAttribute('data-user-id')));
  });

  const formSubmitRef = document.querySelector('#in-edit-submit');
  if (formSubmitRef) formSubmitRef.addEventListener('click', handleEditSubmit);
})();
