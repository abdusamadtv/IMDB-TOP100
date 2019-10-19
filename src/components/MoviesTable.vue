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
      <v-data-table
        sort-by="rank"
        :headers="headers"
        :loading="loading"
        :items="items"
        :search="search"
        class="elevation-1"
      >
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
          <v-btn icon dark @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ currentMovie.title }}</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row no-gutters>
            <v-col md="6">
              <v-img class="ml-auto mr-5 mx-small-auto" width="300px" height="457px" :src="currentMovie.Poster"></v-img>
            </v-col>
            <v-col md="6">
              <v-list-item two-line>
                <v-list-item-content>
                  <template
                    v-for="(key, index) in [
                      'Genre',
                      'Runtime',
                      'Writer',
                      'Language',
                      'Year',
                      'Country',
                      'Actors',
                      'Awards',
                    ]"
                  >
                    <v-list-item-title :key="key" class="font-weight-bold" :class="{ 'mt-5': index > 0 }">
                      {{ key }}:
                    </v-list-item-title>
                    <v-list-item-subtitle :key="index">{{ currentMovie[key] }}</v-list-item-subtitle>
                  </template>

                  <v-list-item-title class="font-weight-bold mt-5">Plot:</v-list-item-title>
                  <p class="subtitle-1 pb-5">{{ currentMovie.Plot }}</p>
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
import { EXTEND_MOVIE, TOGGLE_FAVORITE } from '@/store/mutation-types'

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
    loading: false,
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
      const API_KEY = process.env.VUE_APP_OMDB_API_KEY
      const API_URL = process.env.VUE_APP_OMDB_API_URL

      if (!movie.Poster) {
        this.loading = true

        try {
          const { data: extendedMovie } = await this.$axios.get(API_URL, {
            params: {
              i: movie.id,
              apikey: API_KEY,
              type: 'movie',
              plot: 'full',
            },
          })

          this.modal = true
          this.loading = false
          this.$store.commit(EXTEND_MOVIE, {
            extendedMovie,
            oldMovie: movie,
          })
        } catch ({ message }) {
          this.alertStatus = 'error'
          this.alertMessage = message
        }
      } else {
        this.modal = true
      }

      this.currentMovie = this.$store.getters.getMovieById(movie.id)
    },
  },
}
</script>
