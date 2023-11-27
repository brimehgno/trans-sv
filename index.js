const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const video = require('./model/video')
const {updateVideo} = require('./controller/video')

const app = express();
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({limit: '50mb'}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect('mongodb+srv://lamvanhongvn:WzpdQNCAOvcH231T@cluster0.gzdvdv2.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Artist links
const videoRoute = require("./routes/video");
app.use("/api/video/", videoRoute);
const userRoute = require("./routes/user")
app.use("/api/auth/", userRoute);
const billRoute = require('./routes/bill')
app.use("/api/bill/", billRoute);
const detailvideo = require('./routes/detailVideo')
app.use("/api/detailvideo/", detailvideo)


  app.put('/data/:id', (req, res) => {
    const { id } = req.params;
    const { name, url } = req.body;
  
    updateVideo(id, { name, url })
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error updating user');
      });
  });



mongoose.connection
  .once("open", () => console.log("Connected"))
  .on("error", (error) => {
    console.log(`Error : ${error}`);
  });

  const port = 4000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });