const sequelize = require('./config/connection');
const express = require('express');
const routes = require('./controllers');
const path = require('path');
const exphbs = require('express-handlebars');
const helpers = require('./utils/helpers');
const session = require('express-session');
// import sequelize 

const app = express();
const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({helpers});
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(routes);

// sequelize sync
sequelize.sync({ force: false  }).then(() => {
  app.listen(PORT, () => console.log('TECH BLOG  Now listening on 3001'));
});
