const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const clientRoutes = require('./routes/shop');

const app = express();

const User = require('./models/user');
// const { nextTick } = require('process');


//template builder
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //to acces public folder & css file

//constructed hard-coded example of creating user
app.use((req, res, next) => {
  User.findById('5fb2653be17ca61720cd626a')
    .then((user) => {
      req.user = user;
      next();
    }).catch((err) => {
      console.log(err);
    });
});

app.use('/admin', adminRoutes);
app.use(clientRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://bogdan:<PASS>@cluster0.yvhgw.mongodb.net/<shop>?retryWrites=true&w=majority')
  .then((result) => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          username: "Bogdan",
          email: "vlas.bogdan28@gmail.com",
          phone: "0740.000.000",
          cart: { items: [] }
        });
        user.save();
      }
    })

    app.listen(3000);
  }).catch((err) => {
    console.log(err);
  });
