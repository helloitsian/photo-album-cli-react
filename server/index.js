import express from 'express';
import cors from 'cors';
import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const app = new express();

app.use(cors())

// proxy for photos to avoid CORS
app.get('/photos', (req, res, next) => {
  try {
    axios.get(`${BASE_URL}${req.url}`)
      .then((photos) => {
        res.json({
          success: true,
          message: photos.data,
        }).status(200);
      })
  } catch(err) {
    res.json({
      success: false,
      message: err,
    }).status(500);
  }
})

app.listen(8000, () => console.log("Server listening on port 8000"));