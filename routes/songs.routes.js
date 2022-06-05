const { randomUUID } = require("crypto");

const express = require('express');
const fs = require('fs');

const songsRouter = express.Router();

let songs = [];

fs.readFile("songs.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        songs = JSON.parse(data);
    }
});


//CRUD SONGS
//CREATE
songsRouter.post("/", (req, res) => {
    const { artist, name, file } = req.body;

    const song = {
        artist,
        name,
        file,
        id: randomUUID(),
    };

    songs.push(song);

    songsFile();

    return res.json(song);

})

//READ ALL
songsRouter.get("/", (req, res) => {
    return res.json(songs);
})

//READ
songsRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const song = songs.find(song => song.id === id);

    return res.json(song);
})

//GET SONGS BY NAME
songsRouter.get("/findByName/:name", (req, res) => {
    const { name } = req.params;

    const filteredSongs = songs.filter(song => song.name.toLowerCase().includes(name.toLowerCase()));

    return res.json(filteredSongs);
})

//UPDATE
songsRouter.put("/:id", (req, res) => {
    const { id } = req.params;
    const songIndex = songs.findIndex(song => song.id === id);
    const song = songs[songIndex];
    const { artist = song.artist, name = song.name, file = song.file } = req.body;

    songs[songIndex] = {
        ...songs[songIndex],
        artist,
        name,
        file
    };

    songsFile();
    return res.json({ message: "Song successfully changed!" });
})

//DELETE
songsRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const songIndex = songs.findIndex(song => song.id === id);

    songs.splice(songIndex, 1);

    songsFile();
    return res.json({ message: "Song successfully removed!" })
})

function songsFile() {
    fs.writeFile("songs.json", JSON.stringify(songs), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Songs updated!`)
        }
    });
}

module.exports = songsRouter;