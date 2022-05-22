const { CartModel } = require('../models/cart.model');
const { PokemonModel } = require('../models/pokemon.model');
const { UserModel } = require('../models/user.model');

const createCart = async userId => {
  const cart = await CartModel.create({ userId, pokemon: [] });

  await UserModel.findByIdAndUpdate(userId, {
    $set: { activeCart: cart.cartId },
  });

  return cart.cartId;
};

const addToCart = async (req, res) => {
  const { _id } = req.session;
  const { id: pokemonId, quantity } = req.body;
  
  const user = await UserModel.findById(_id);

  if (user) {
    const cartId = user.activeCart ? user.activeCart : await createCart(_id);

    const { id, name, sprites, stats } = await PokemonModel.findOne({ id: pokemonId });

    await CartModel.updateOne({
      cartId,
    }, {
      $push: {
        pokemon: {
          id,
          name,
          quantity,
          sprite: sprites.other.dream_world.front_default,
          price: stats[0].base_stat,
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        cartId,
      },
    });
  }
};

const checkout = async (req, res) => {
  const { id } = req.body;

  try {
    await Promise.all([
      CartModel.updateOne({ cartId: id }, {
        $set: {
          isArchived: true,
        },
      }),
      UserModel.findByIdAndUpdate(req.session._id, {
        $set: {
          activeCart: null,
        },
      }),
    ]);
  } catch (e) {
    return res.status(400).json({
      success: false,
      data: {
        msg: 'Cart could not be found',
      },
    });
  }

  return res.status(200).json({
    success: true,
    data: null,
  });
};

module.exports = { addToCart, checkout };
