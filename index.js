require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

// Load the URI from the .env file
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

// Enable CORS for all routes
app.use(cors());

async function connectToDb() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error(err);
  }
}

// Initialize connection to MongoDB when the server starts
connectToDb();

app.get("/movie/:title", async (req, res) => {
  try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");

    const title = req.params.title;
    const query = { title: title };
    const movie = await movies.findOne(query);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
