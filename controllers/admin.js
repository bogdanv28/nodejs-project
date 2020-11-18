const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product',
    {
      pageTitle: 'Admin - Add Product',
      path: '/admin/add-product',
      editing: false
    })
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;
  const product = new Product({ title: title, price: price, description: description, imageURL: imageURL });
  product.save()
    .then(result => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {

  Product.find().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin - All Products',
      path: '/admin/products',
      isAuthenticated: req.isLoggedIn
    });
  }).catch(err => console.log(err));

}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

//for updading the product
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; //name="productId" from view/edit-product
  const updTitle = req.body.title;
  const updPrice = req.body.price;
  const updImageUrl = req.body.imageURL;
  const updDescr = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      product.title = updTitle;
      product.price = updPrice;
      product.description = updDescr;
      product.imageURL = updImageUrl;
      return product.save();
    }).then(result => {
      console.log('product updated!')
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));

}
