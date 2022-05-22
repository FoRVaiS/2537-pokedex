(async () => {
  const { query } = window.pokedex;

  const cartRef = document.querySelector('.cart');
  const summaryRef = document.querySelector('.checkout > .checkout__summary');

  const appendCartItem = ({ id, name, quantity, sprite, price }) => {
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
    right.append(qtyField);

    const priceText = document.createElement('p');
    priceText.classList.add('item__price');
    priceText.textContent = `$${price}`;
    right.append(priceText);


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

  const { success, data: pokemon } = await query('/api/v2/user/cart');
  let totalPrice = 0;

  if (success) pokemon.forEach(_pokemon => {
    totalPrice += _pokemon.price * _pokemon.quantity;
    appendCartItem(_pokemon);
    appendSummaryItem(_pokemon);
  });

  const totalRef = document.querySelector('#total');

  if (totalRef) totalRef.textContent = `$${totalPrice}`;
})();
