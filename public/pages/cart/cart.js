(async () => {
  const { query } = window.pokedex;

  const cartId = (new URL(window.location.href)).pathname.split('/').pop();
  const results = await query(`/api/v2/user/cart/${cartId}`);

  let { pokemon } = results.data;
  const { success, data: { isArchived } } = results;

  const cartRef = document.querySelector('.cart');
  const summaryRef = document.querySelector('.checkout > .checkout__summary');

  const appendCartItem = _pokemon => {
    const { id, name, quantity, sprite, price } = _pokemon;
    const root = document.createElement('div');
    root.classList.add('item');

    const left = document.createElement('div');
    left.classList.add('group');
    left.classList.add('group--inline');
    left.classList.add('item__left');
    root.append(left);

    const right = document.createElement('div');
    right.classList.add('group');
    right.classList.add('group--inline');
    right.classList.add('item__right');
    root.append(right);

    const img = document.createElement('img');
    img.classList.add('item__icon');
    img.crossOrigin = 'cross-origin';
    img.src = sprite;
    left.append(img);

    const itemName = document.createElement('h4');
    itemName.classList.add('item__name');
    itemName.classList.add('u-clear-header');
    itemName.textContent = name;
    left.append(itemName);

    const qtyField = document.createElement('input');
    qtyField.classList.add('item__quantity');
    qtyField.setAttribute('name', 'quantity');
    qtyField.setAttribute('data-id', id);
    qtyField.setAttribute('min', 1);
    qtyField.value = quantity;
    qtyField.type = 'number';
    qtyField.onchange = async () => {
      await query('/api/v2/user/cart/quantity', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          quantity: Number(qtyField.value),
        }),
      });
      _pokemon.quantity = Number(qtyField.value);
      // eslint-disable-next-line no-use-before-define
      renderCart(pokemon);
    };
    right.append(qtyField);

    const priceText = document.createElement('p');
    priceText.classList.add('item__price');
    priceText.textContent = `$${price}`;
    right.append(priceText);

    const deleteIco = document.createElement('i');
    deleteIco.classList.add('bi');
    deleteIco.classList.add('bi-trash');
    deleteIco.type = 'number';
    deleteIco.onclick = () => {
      query('/api/v2/user/cart/remove/item', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      pokemon = pokemon.filter(_pokemon => _pokemon.id !== id);

      // eslint-disable-next-line no-use-before-define
      renderCart(pokemon);
    };
    right.append(deleteIco);

    cartRef.append(root);
  };

  const appendSummaryItem = ({ name, quantity, price }) => {
    const root = document.createElement('div');
    root.classList.add('item');

    const left = document.createElement('div');
    left.classList.add('group');
    left.classList.add('group--inline');
    left.classList.add('item__left');
    root.append(left);

    const right = document.createElement('div');
    right.classList.add('group');
    right.classList.add('group--inline');
    right.classList.add('item__right');
    root.append(right);

    const itemName = document.createElement('h4');
    itemName.classList.add('item__name');
    itemName.classList.add('u-clear-header');
    itemName.textContent = name;
    left.append(itemName);
    
    const quantityText = document.createElement('p');
    quantityText.classList.add('u-clear-header');
    quantityText.textContent = `x${quantity}`;
    left.append(quantityText);

    const priceText = document.createElement('p');
    priceText.classList.add('item__price');
    priceText.textContent = `$${quantity * price}`;
    right.append(priceText);

    summaryRef.append(root);
  };

  let totalPrice = 0;

  const renderCart = _pokemon => {
    totalPrice = 0;

    cartRef.innerHTML = '';
    summaryRef.innerHTML = '';

    _pokemon.forEach(__pokemon => {
      totalPrice += __pokemon.price * __pokemon.quantity;
      appendCartItem(__pokemon);
      appendSummaryItem(__pokemon);
    });

    const totalRef = document.querySelector('#total');

    if (totalRef) totalRef.textContent = `$${totalPrice}`;
  };

  const checkoutBtn = document.querySelector('input[value="Checkout"]');

  checkoutBtn.onclick = async e => {
    e.preventDefault();

    const data = await query('/api/v2/user/cart/checkout', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cartId,
      }),
    });

    if (data.success) {
      // TODO: Display alert indicating the cart is now archived
      // eslint-disable-next-line no-return-assign
      setTimeout(() => window.location.href = '/', 5e3);
    }
  };

  const discardBtn = document.querySelector('input[value="Discard Cart"]');

  discardBtn.onclick = async e => {
    e.preventDefault();

    const data = await query('/api/v2/user/cart/remove', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: cartId,
      }),
    });

    if (data.success) {
      // TODO: Display alert indicating the cart is now removed
      // eslint-disable-next-line no-return-assign
      setTimeout(() => window.location.href = '/', 5e3);
    }
  };

  if (success) {
    renderCart(pokemon);

    if (isArchived) {
      // eslint-disable-next-line no-return-assign
      Array.from(document.querySelectorAll('main input')).forEach(input => input.disabled = true);
    }
  }
})();
