(() => {
  const { query, getRequiredValueFrom } = window.pokedex;

  let _id = null;

  const handleEdit = id => window.location.href = `/dashboard?id=${id}`;

  const handleEditSubmit = async e => {
    e.preventDefault();

    const username = getRequiredValueFrom('input[name=\'username\']', String);
    const password = getRequiredValueFrom('input[name=\'password\']', String);
    const firstName = getRequiredValueFrom('input[name=\'first-name\']', String);
    const lastName = getRequiredValueFrom('input[name=\'last-name\']', String);

    if ([username, password, firstName, lastName].includes(null)) return null;

    const { success } = await query('/api/v2/user/edit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id, username, password, firstName, lastName }),
    });

    if (success) window.location.href = '/dashboard';
  };

  const handleDelete = async () => {
    const { success } = await query('/api/v2/user/delete', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id }),
    });

    if (success) window.location.href = '/dashboard';
  };

  const userEditBtns = document.querySelectorAll('.in-edit');
  userEditBtns.forEach(editBtn => {
    _id = editBtn.getAttribute('data-user-id');
    editBtn.addEventListener('click', handleEdit.bind(null, editBtn.getAttribute('data-user-id')));
  });

  const userDelBtns = document.querySelectorAll('.in-delete');
  userDelBtns.forEach(delBtn => {
    delBtn.addEventListener('click', handleDelete.bind(null));
  });

  const formSubmitRef = document.querySelector('#in-edit-submit');
  if (formSubmitRef) formSubmitRef.addEventListener('click', handleEditSubmit);
})();
