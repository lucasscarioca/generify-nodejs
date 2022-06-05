const { randomUUID } = require("crypto");

const express = require('express');
const fs = require('fs');

const playlistsRouter = express.Router();

let playlists = [];

fs.readFile("playlists.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        playlists = JSON.parse(data);
    }
});

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
playlistsRouter.post("/", (req, res) => {
    const { name, cover, about, songs, owner = null } = req.body;

    const playlist = {
        name,
        cover,
        about,
        songs,
        owner,
        id: randomUUID(),
    };

    playlists.push(playlist);

    playlistsFile();

    return res.json(playlist);

})

//READ ALL
playlistsRouter.get("/all", (req, res) => {
    return res.json(playlists);
})

//READ
playlistsRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const playlist = playlists.find(playlist => playlist.id === id);

    return res.json(playlist);
})

//GET ONLY PUBLIC PLAYLISTS
playlistsRouter.get("/", (req, res) => {
    const publicPlaylists = playlists.filter(playlist => playlist.owner === null)

    return res.json(publicPlaylists);
})

//GET PLAYLIST SONGS
playlistsRouter.get("/:id/songs", (req, res) => {
    const { id } = req.params;
    const playlist = playlists.find(playlist => playlist.id === id);
    const playlistSongs = songs.filter(song => playlist.songs.includes(song.id))

    return res.json(playlistSongs);
})

//UPDATE
playlistsRouter.put("/:id", (req, res) => {
    const { id } = req.params;
    const playlistIndex = playlists.findIndex(playlist => playlist.id === id);
    const playlist = playlists[playlistIndex];
    const { name = playlist.name, cover = playlist.cover, about = playlist.about, songs = playlist.songs, owner = playlist.owner } = req.body;

    playlists[playlistIndex] = {
        ...playlists[playlistIndex],
        name,
        cover,
        about,
        songs,
        owner
    };

    playlistsFile();
    return res.json({ message: "Playlist successfully changed!" });
})

//DELETE
playlistsRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const playlistIndex = playlists.findIndex(playlist => playlist.id === id);

    playlists.splice(playlistIndex, 1);

    playlistsFile();
    return res.json({ message: "Playlist successfully removed!" })
})


function playlistsFile() {
    fs.writeFile("playlists.json", JSON.stringify(playlists), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Playlists updated!`)
        }
    });
}

module.exports = playlistsRouter;