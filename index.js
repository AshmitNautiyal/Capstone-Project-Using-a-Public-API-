import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

//app.set('view engine', 'ejs');

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
      let pokemons = [];
      const pokemonName = req.query.pokemonName;
  
      if (pokemonName) {
        // Fetch data for a specific Pokémon by name
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        pokemons = [response.data]; // Wrap it in an array for consistent rendering
      } else {
        // Fetch data for multiple Pokémon (first 60)
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=60');
        const pokemonList = response.data.results;
  
        // Now fetch detailed data for each Pokémon
        pokemons = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const pokeDetails = await axios.get(pokemon.url);
            return pokeDetails.data;
          })
        );
      }
      res.render('index.ejs', { pokemons });
    }
   
   catch (error) {
    console.error('Error fetching Pokémon data:', error);
    res.status(500).send('Pokémon not found. Please try another name');
  // displayErrorMessage("Pokémon not found. Please try another name.");
  }
});



app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });