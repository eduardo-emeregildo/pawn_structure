const express = require('express');
const app = express();
const queryRoutes = require('./api/routes/queries');

// app.use((req,res,next) =>{
//     res.status(200).json({
//         message: "It works :P"
//     });
// });
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use('/queries', queryRoutes);


module.exports = app