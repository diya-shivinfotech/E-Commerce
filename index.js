const express = require('express');
const dotenv = require('dotenv');
const messages = require('./api/utils/messages');
const logger = require('./api/logger/logger');
const cors = require('cors');
const bodyParser = require('body-parser');
const route = require('./api/routes/route');
const morgan = require('morgan');
const path = require('path');

const app = express();
dotenv.config();
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

app.use('/api', route);

app.get('/', (req, res) => {
  res.send(`Server ${messages.SERVER_RUNNING}`);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server ${messages.SERVER_RUNNING} ${PORT}`);
});
