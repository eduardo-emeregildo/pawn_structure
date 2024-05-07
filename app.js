const express = require('express');
const app = express();
const morgan = require('morgan');
const queryRoutes = require('./api/routes/queries');
const pgnsRoutes = require('./api/routes/pgns');
app.use(morgan('dev'));

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
app.use('/pgns', pgnsRoutes);



// invalid routes
app.use((req,res,next) =>{
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error,req,res,next) =>{
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message
    }
  });

});


module.exports = app