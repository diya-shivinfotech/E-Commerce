const express = require('express');
const dotenv = require('dotenv');
const messages = require('./api/utils/messages');
const logger = require('./api/logger/logger');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const route = require('./api/routes/route');
const sequelize = require('./api/database/db');

const app = express();
app.use(express.json());
dotenv.config();
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/api', route);

app.get('/', (req, res) => {
  res.send(`Server ${messages.SERVER_RUNNING}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize
  .sync({ alter: false })
  .then(() => {
    logger.info(`Table created ${messages.Is_SUCCESS}`);
  })
  .catch((err) => {
    logger.warn(`Table sync ${messages.IS_INCORRECT}`, err);
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server ${messages.SERVER_RUNNING} ${PORT}`);
});
