const Router = require('express');
const usersRouter = require('./users.routes');
const songsRouter = require('./songs.routes');
const playlistsRouter = require('./playlists.routes');

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/songs', songsRouter);
routes.use('/playlists', playlistsRouter);

module.exports = routes;