const Product = require('../models/product');
const Order = require('../models/order');
const nodemailer = require('nodemailer');
const sendgridMail = require('nodemailer-sendgrid-transport');

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop-client/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products', //for navbar active link
      });
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop-client/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products'
    });
  }).catch(err => console.log(err));
}
//to render index page
exports.getIndex = (req, res, next) => {
  Product.find().then(products => {
    res.render('shop-client/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};

//getting user's cart
exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop-client/cart', {
        path: '/cart',
        pageTitle: 'Cart',
        products: products
      });
    }).catch((err) => {

    });
}


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(result => res.redirect('/cart'))
    .catch((err) => {
      console.log(err);
    });
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postCartUpdateQuantity = (req, res, next) => {
  const prodId = req.body.productId;
  const qty = req.body.quantity;
  req.user.updateQuantity(prodId, qty)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {

  const transporter = nodemailer.createTransport(sendgridMail({
    auth: {
      api_key: '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'
    }
  }))
  function orderDet(productName, productPrice, qty) {
    this.productName = productName;
    this.productPrice = productPrice;
    this.qty = qty;
  }
  let cartDetails = [];
  let totalPrice = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      
      user.cart.items.forEach(item => totalPrice += +item.productId.price * item.quantity);
      console.log('******totalPrice: ' + totalPrice);
      user.cart.items.forEach(item => cartDetails.push(new orderDet(item.productId.title, item.productId.price, item.quantity)));
  
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          username: req.user.username,
          userId: req.user
        },
        products: products,
        totalPrice: totalPrice
      });
      return order.save();
    }).then(() => {
      
      return transporter.sendMail({
        to: req.user.email + ', vlas.bogdan@yahoo.com',
        from: 'shop-node@outlook.com',
        subject: 'Order Submited', 
        text: 'Order submited. Thank you! \n' +
          'Order details: ' + showDetails(cartDetails) + 
          '\nTotal Price: ' + totalPrice +
          '\nDelivery Address :' + req.body.city + ", "  + req.body.address +
          '\nFor: '+ req.user.username + 
          '\nPhone' + req.user.phone
      });
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

function showDetails(arr){
  let str = "\n";
  for(let i=0; i<arr.length; i++){
    str += "Product: " + arr[i].productName;
    str += ", Price: " + arr[i].productPrice;
    str += ", Quantity"+arr[i].qty;
    str += "\n ";
  }
  return str;
}