<template>
  <v-app>
    <v-card tile>
      <v-tabs background-color="light-blue accent-4" centered dark icons-and-text>
        <v-tab :to="{ name: 'home' }" exact>
          Main
          <v-icon>mdi-home</v-icon>
        </v-tab>

        <v-tab :to="{ name: 'favorite' }">
          Favorite
          <v-icon>mdi-heart</v-icon>
        </v-tab>
      </v-tabs>

      <router-view></router-view>
    </v-card>
  </v-app>
</template>

<style lang="scss">
@media screen and (max-width: 959px) {
  #app .mx-small-auto {
    margin: 0 auto !important;
  }
}
</style>
