import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import movies from '@/data/movies'
import { EXTEND_MOVIE, TOGGLE_FAVORITE } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies,
  },
  getters: {
    movies: state => state.movies,
    favoriteMovies: state => state.movies.filter(movie => movie.favorite),
    getMovieById: state => id => state.movies.find(movie => movie.id === id),
  },
  mutations: {
    [TOGGLE_FAVORITE](state, updatedMovie) {
      const oldMovieIndex = state.movies.findIndex(movie => movie.id === updatedMovie.id)
      const newMovie = { ...updatedMovie, favorite: !updatedMovie.favorite }

      state.movies.splice(oldMovieIndex, 1, newMovie)
    },
    [EXTEND_MOVIE](state, { oldMovie, extendedMovie }) {
      const oldMovieIndex = state.movies.findIndex(movie => movie.id === oldMovie.id)
      const newMovie = { ...extendedMovie, ...oldMovie }

      state.movies.splice(oldMovieIndex, 1, newMovie)
    },
  },
  plugins: [createPersistedState()],
})
