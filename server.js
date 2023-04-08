const mongoose = require('mongoose');
const app = require('./app');
// 8NtEeLUEDfATyaOE
const DB_HOST = "mongodb+srv://Valeria:8NtEeLUEDfATyaOE@cluster0.nafxeoi.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.connect(DB_HOST)
  .then(() => app.listen(3000))
  .catch(error => console.log(error.message));

