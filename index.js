const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/orders');
const errorHandler = require('./error-handlers');
const local = 'mongodb://localhost:27017/BuzzBoard'
const port = 3000

const app = express();

app.use(express.json());
app.use(cors());
app.use('/order', productRoutes);
app.use(errorHandler);

mongoose.set("strictQuery", false);
mongoose
  .connect(local, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${ port } `);
    });
  })
  .catch((error) => {
    console.error(error);
  });
