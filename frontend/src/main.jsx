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

import AdminRoute from './pages/admin/adminRoute.jsx';
import GenreList from './pages/admin/genres.jsx';
import GenreCreate from './components/genreForm.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="profile" element={<Profile />} />
      <Route path="profile/edit" element={<EditProfile />} />

      <Route element={<AdminRoute />}>
        <Route path="admin/genres" element={<GenreList />} />
        <Route path="admin/genres/new" element={<GenreCreate />} />
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
