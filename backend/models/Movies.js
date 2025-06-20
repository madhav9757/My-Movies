import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  releaseDate: {
    type: Date,
  },
  director: {
    type: String,
    default: "",
  },
  image: {
    type: String, 
    default: '',  
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
