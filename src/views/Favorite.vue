<template>
  <MoviesTable :items="favoriteMovies" is-favorites />
</template>

<script>
export default {
  name: 'Favorite',
  components: {
    MoviesTable: () => import('@/components/MoviesTable'),
  },
  computed: {
    favoriteMovies() {
      return this.$store.getters.favoriteMovies
    },
  },
}
</script>
