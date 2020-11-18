const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const product = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  }
  
}); 

module.exports = mongoose.model('Product', product);


// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageURL, id) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageURL = imageURL;
//     this._id = id ?  new mongodb.ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     let dbOperation;
//     if(this._id){
//       //we update the product if id exists
//       dbOperation =db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, 
//       {$set: this});
//     } else{
//       //we create a new prd
//       dbOperation = db.collection('products').insertOne(this);
//     }
//     return dbOperation
//     .then(result => {
//       console.log(result);
//     })
//     .catch(error => console.log(error));
//   }

//   static fetchAll(){
//     const db = getDb();
//     return db.collection('products').find().toArray()
//     .then(products => {
//       return products;
//     })
//     .catch(err => console.log(err));
//   }

//   static findById(id){
//     const db = getDb();
//     return db.collection('products').find({_id: new mongodb.ObjectId(id)}).next()
//     .then(product => {
//       return product;
//     })
//     .catch(err => console.log(err));
//   }

//   static deleteById(id){
//     const db = getDb();
//     return db.collection('products').deleteOne({_id: new mongodb.ObjectId(id)}).then(result => console.log("product deleted")).catch(err => console.log(err));
//   }

// }

// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     autoIncrement: true,
// //     allowNull: false,
// //     primaryKey: true
// //   },
// //   title: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   price: {
// //     type: Sequelize.DOUBLE,
// //     allowNull: false
// //   },
// //   description: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   },
// //   imageURL: {
// //     type: Sequelize.STRING,
// //     allowNull: false
// //   }
// // });

// module.exports = Product;

