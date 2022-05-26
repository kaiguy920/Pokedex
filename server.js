const express = require('express')
const { type } = require('express/lib/response')

const app = require("liquid-express-views")(express())

const methodOverride = require("method-override")

const port = 3000
// =======================================================
//                       MIDDLEWARE
// =======================================================

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride("_method"))

app.use((req, res, next) => {
    next();
})

// for CSS
app.use(express.static('skeleton'))

// =======================================================
//                       ROUTES
// =======================================================

const pokemon = require('./pokedex/models/pokemon.js')

app.get('/pokemon/', (req, res) => {
    res.render('index', { pokemon: pokemon })
})

// new pokemon form
app.get('/pokemon/new', (req, res) => {
    res.render('new')
})

// add new pokemon data from form to the index page
app.post('/pokemon/', (req, res) => {
    let pokeItem = req.body
    pokeItem.stats = {
        hp: pokeItem.hp,
        attack: pokeItem.attack,
        defense: pokeItem.defense,
        spattack: pokeItem.spattack,
        spdefense: pokeItem.spdefense,
        speed: pokeItem.speed
    }

    pokemon.push(pokeItem)
    console.log("req.body", pokeItem)
    res.redirect('/pokemon/')
})

// DELETE ROUTE

app.delete("/pokemon/:id", (req, res) => {
    pokemon.splice(req.params.id, 1); //remove the item from the array
    res.redirect("/pokemon"); //redirect back to index route

});

//   EDIT ROUTE -- JUUUST SHOWING FORM

app.get("/pokemon/:id/edit", (req, res) => {
    res.render(
        "edit", { pokemon: pokemon[req.params.id], index: req.params.id }
    )
})

// UPDATE ROUTE 
app.put("/pokemon/:id/", (req, res) => {
    // console.log('=================req==================', req);
    let pokeItem = req.body

    console.log('pokeItem', pokeItem)
    const updatedPokemon = {
        name: pokeItem.name,
        type: pokeItem.type,
        stats: {
            hp: pokeItem.hp,
            attack: pokeItem.attack,
            defense: pokeItem.defense,
            spattack: pokeItem.spattack,
            spdefense: pokeItem.spdefense,
            speed: pokeItem.speed

        },
        img: pokemon[req.params.id].img,
        id: pokemon[req.params.id].id
    }
    pokemon[req.params.id] = updatedPokemon
    console.log(pokemon[req.params.id]);
    res.redirect("/pokemon/") //redirect to the index page
});

// SHOW info of pokemon when clicked on index page
app.get('/pokemon/:id', (req, res) => {
    console.log('pokemon[req.params.id]', pokemon[req.params.id])
    res.render('show', { pokemon: pokemon[req.params.id] })
})


// =======================================================
//                       PORT
// =======================================================

app.listen(port, () => {
    console.log('server running');
})


// =======================================================
//                       MVP CRITERIA
// =======================================================
// - display a bunch of Pokémon images on the index
// - have separate show pages for each Pokémon, accessible by clicking on a Pokémon's image on the index page
// - have the ability to add a new Pokémon
// - have the ability to edit existing Pokémon
// - have the ability to delete Pokémon
// - have some styling