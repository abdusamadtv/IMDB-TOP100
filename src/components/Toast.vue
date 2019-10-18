<template>
  <v-snackbar :value="value" :timeout="1000" color="success" @input="$emit('input', $event.target.value)">
    The movie has been added to favorite successfully
    <v-btn text @click="$emit('input', false)">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: () => false,
    },
  },
}
</script>
