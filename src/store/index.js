import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import movies from '@/data/movies'
import { UPDATE_MOVIE, TOGGLE_FAVORITE } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    movies,
  },
  getters: {
    movies: state => state.movies,
    favoriteMovies: state => state.movies.filter(movie => movie.favorite),
  },
  mutations: {
    [TOGGLE_FAVORITE](state, newMovie) {
      const oldMovieIndex = state.movies.findIndex(movie => movie.id === newMovie.id)

      newMovie = { ...newMovie, favorite: !newMovie.favorite }

      state.movies.splice(oldMovieIndex, 1, newMovie)
    },
    [UPDATE_MOVIE](state, { oldMovie, extendedMovie }) {
      const oldMovieIndex = state.movies.findIndex(movie => movie.id === oldMovie.id)

      extendedMovie = { ...extendedMovie, ...oldMovie }

      state.movies.splice(oldMovieIndex, 1, extendedMovie)
    },
  },
  plugins: [createPersistedState()],
})
