<template>
  <v-card>
    <v-card-title>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-movie-search"
        hide-details
        label="Search"
        single-line
      ></v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="items" :search="search" class="elevation-1">
        <template v-slot:item.action="{ item }">
          <v-btn text icon color="blue" class="mr-2" title="View details" @click="getMovie(item)">
            <v-icon>mdi-library-movie</v-icon>
          </v-btn>
          <v-btn text icon color="red" title="Add to favorite" @click="toggleFavorite(item)">
            <v-icon>
              {{ item.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
          </v-btn>
        </template>

        <template v-if="isFavorites" v-slot:no-data>
          No movies have been found. <v-btn :to="{ name: 'home' }" tile class="ml-5" color="primary">Add movie</v-btn>
        </template>

        <template v-if="isFavorites" v-slot:no-results>
          No movies have been found. <v-btn :to="{ name: 'home' }" tile class="ml-5" color="primary">Add movie</v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <v-snackbar v-model="snackbar" :timeout="1000" :color="alertStatus">
      {{ alertMessage }}
      <v-btn text @click="$emit('input', false)">
        Close
      </v-btn>
    </v-snackbar>

    <v-dialog v-model="modal" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar fixed dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ currentMovie.title }}</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row no-gutters>
            <v-col md="6" class="pr-5">
              <v-img class="ml-auto" width="300px" height="457px" :src="currentMovie.Poster"></v-img>
            </v-col>
            <v-col md="6">
              <!-- <div class="d-flex flex-column"></div> -->
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">Genre:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Genre }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Runtime:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Runtime }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Writer:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Writer }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Language:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Language }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Year:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Year }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Country:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Country }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Actors:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Actors }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Awards:</v-list-item-title>
                  <v-list-item-subtitle>{{ currentMovie.Awards }}</v-list-item-subtitle>
                  <v-list-item-title class="font-weight-bold mt-5">Plot:</v-list-item-title>
                  <p class="subtitle-1">{{ currentMovie.Plot }}</p>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { UPDATE_MOVIE, TOGGLE_FAVORITE } from '@/store/mutation-types'

export default {
  name: 'Home',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    isFavorites: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    search: '',
    modal: false,
    snackbar: false,
    currentMovie: {},
    alertStatus: '',
    alertMessage: '',
    headers: [
      {
        text: 'ID',
        value: 'id',
        width: '15%',
      },
      {
        text: 'Rank',
        value: 'rank',
        width: '15%',
      },
      {
        text: 'Title',
        value: 'title',
        width: '60%',
      },
      {
        text: 'Actions',
        value: 'action',
        width: '10%',
        sortable: false,
      },
    ],
  }),
  methods: {
    toggleFavorite(movie) {
      this.alertMessage = `The ${movie.title} has been added to favorite successfully`
      this.alertStatus = 'success'
      this.snackbar = movie.favorite ? false : true
      this.$store.commit(TOGGLE_FAVORITE, movie)
    },
    async getMovie(movie) {
      const API_KEY = process.env.VUE_APP_OMBDB_API_KEY
      const API_URL = process.env.VUE_APP_OMBDB_API_URL

      this.modal = true

      if (!movie.Poster) {
        try {
          const { data: extendedMovie } = await this.$axios.get(API_URL, {
            params: {
              i: movie.id,
              apikey: API_KEY,
              type: 'movie',
              plot: 'full',
            },
          })

          this.currentMovie = extendedMovie
          this.$store.commit(UPDATE_MOVIE, {
            extendedMovie,
            oldMovie: movie,
          })

          console.log(extendedMovie)
        } catch ({ message }) {
          this.alertStatus = 'error'
          this.alertMessage = message
        }
      } else {
        this.currentMovie = movie
      }
    },
  },
}
</script>
