const { randomUUID } = require("crypto");

const express = require('express');
const fs = require('fs');

const usersRouter = express.Router();

let users = [];


fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        users = JSON.parse(data);
    }
});

let playlists = [];

fs.readFile("playlists.json", "utf-8", (err, data) => {
    if (err) {
        console.log(err);
    } else {
        playlists = JSON.parse(data);
    }
});


//CRUD USERS
//CREATE
usersRouter.post("/", (req, res) => {
    const { username, password, email, birthDate, userPlaylists } = req.body;

    const user = {
        username,
        email,
        password,
        birthDate,
        userPlaylists,
        createdAt: new Date(),
        id: randomUUID(),
    };

    users.push(user);

    usersFile();

    return res.json(user);

})

//READ ALL
usersRouter.get("/", (req, res) => {
    return res.json(users);
})

//READ
usersRouter.get("/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find(user => user.id === id);

    return res.json(user);
})

//GET USER PLAYLISTS
usersRouter.get("/:id/playlists", (req, res) => {
    const { id } = req.params;
    const user = users.find(user => user.id === id);
    const userPlaylists = playlists.filter(playlist => user.userPlaylists.includes(playlist.id))

    return res.json(userPlaylists);
})

//UPDATE
usersRouter.put("/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    const user = users[userIndex];
    const { username = user.username, email = user.email, password = user.password, birthDate = user.birthDate, userPlaylists = user.userPlaylists } = req.body;

    users[userIndex] = {
        ...user,
        username,
        email,
        password,
        birthDate,
        userPlaylists
    };

    usersFile();
    return res.json({ message: "User successfully changed!" });
})

//DELETE
usersRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);

    users.splice(userIndex, 1);

    usersFile();
    return res.json({ message: "User successfully removed!" })
})


function usersFile() {
    fs.writeFile("users.json", JSON.stringify(users), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Users updated!`)
        }
    });
}

module.exports = usersRouter;