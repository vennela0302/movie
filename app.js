const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

app.use(express.json());

let db = null;

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBandServer();

//API 1

app.get("/movies/", async (req, res) => {
  const getMovieQuery = `
    SELECT movie_name FROM movie ;
    `;
  const updateDBObject = (dbObject) => {
    return { movieName: dbObject.movie_name };
  };
  const getMovieName = await db.all(getMovieQuery);
  res.send(getMovieName.map((eachPlayer) => updateDBObject(eachPlayer)));
});

// API 2

app.post("/movies/", async (req, res) => {
  const movieDetails = req.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const createNewMovie = `
    INSERT INTO movie (director_id, movie_name,lead_actor)
    VALUES (${directorId}, '${movieName}', '${leadActor}')`;
  const dbResponse = await db.run(createNewMovie);
  const movieId = dbResponse.lastId;
  res.send("Movie Successfully Added");
});

// API 3
// doubt

app.get("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const getMovieQuery = `
    SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const getMovie = await db.get(getMovieQuery);
  res.send(getMovie);
});

// API 4

app.put("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const movieDetails = req.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovieDetails = `
    UPDATE movie SET 
        director_id = ${directorId},
        movie_name= '${movieName}',
        lead_actor= '${leadActor}'
    WHERE movie_id = ${movieId};
    `;
  const getMovie = await db.run(updateMovieDetails);
  res.send("Movie Details Updated");
});

module.exports = app;
