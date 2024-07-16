

const express=require("express");
const path=require("path");
const {open}=require("sqlite");
const sqlite3=require("sqlite3");


const app=express();

const port=4447;
const dbPath=path.join(__dirname,"moviesdata.db");
let db=null;

const initializeDBAndServer= async()=>{
    try {
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(port,()=>{
            console.log(`DB Conected \n Server running on ${port}`)
        })
    } catch (e) {
        console.log(`DB Error:${e.message}`);
        process.exit(1)
    }
}
initializeDBAndServer();

    

// GET METHOD
app.get("/movies",async(req,res)=>{
  const getmoviesQuery=`SELECT * FROM movie `;
  const movie=await db.all(getmoviesQuery);
  res.send(movie);
});

// POST METHOD
app.use(express.json())
app.post("/movies",async(req,res)=>{
  const {movie_id,director_id,movie_name,lead_actor}=req.body;
  console.log(req.body)
  try {
    const addMovieQuery=`INSERT INTO movie(movie_id,director_id,movie_name,lead_actor)
    VALUES(
   ${movie_id},
    ${director_id},
   '${movie_name}',
   ' ${lead_actor}');`;
        const movie=await db.run(addMovieQuery);
        res.status(200).json({message:`Movie added successfully with ${movie.lastID}`});
  } catch (e) {
    console.log("/movies",e.message);
    res.status(500).send("internal server error");
  }
});

// GET METHOD USING ID
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const getmoviesQuery = `
   SELECT
   *
  FROM
 movie
  WHERE
  movie_id = ${id};`;
  const moviesArray = await db.all(getmoviesQuery);
  res.send(moviesArray);
 });
 
//  PUT METHOD
app.use(express.json())
    app.put("/movies/:id",async(req,res)=>{
        const { id } = req.params;
      const {movie_id,director_id,movie_name,lead_actor}=req.body;
      console.log(req.body)
      try {
        const addMovieQuery=`UPDATE movie
         SET
         movie_name= '${movie_name}'
         WHERE 
         director_id=${id};`;
            const movie=await db.run(addMovieQuery);
            res.status(200).json({message:`movie updated successfully with ${movie.lastID}`});
      } catch (e) {
        console.log("/movies",e.message);
        res.status(500).send("internal server error");
      }
    });

    // DELETE METHOD
        
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
   const deletemovieQuery = `
   DELETE FROM
   movie
  WHERE
   movie_id = ${id};`;
   await db.run(deletemovieQuery);
   res.send("movie Deleted Successfully");
  });
  
