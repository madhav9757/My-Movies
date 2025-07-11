import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

import App from './App.jsx';
import Home from './pages/home.jsx';
import Login from './pages/auth/login.jsx';
import Signup from './pages/auth/signup.jsx';
import Profile from './pages/user/profile.jsx';
import EditProfile from './pages/user/editProfile.jsx';
import store from './redux/store.js';
import './index.css';

import UserProfile from './pages/user/userProfile.jsx';
import GenreList from './pages/Genre/genres.jsx';
import GenreCreate from './components/genreForm.jsx';
import Movies from './pages/Movies/movies.jsx';
import AddMovie from './components/movie/addMovie.jsx';
import EditMovie from './components/movie/editMovie.jsx';
import MovieDetails from './pages/Movies/MovieDetails.jsx';
import GenreMovies from './pages/Movies/genreMovie.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/:userId" element={<UserProfile />} />

      <Route>
        <Route path="/genres" element={<GenreList />} />
        <Route path="/genres/new" element={<GenreCreate />} />
        <Route path="/genres/:genreId/movies" element={<GenreMovies />} />
      </Route>

      <Route>
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/add" element={<AddMovie />} />
        <Route path="/movies/edit/:id" element={<EditMovie />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
