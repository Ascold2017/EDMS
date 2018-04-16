<template lang='pug'>
  div
    v-subheader(v-if='selectedUsers.length') Список віз:
    draggable(
      id='authors-selected'
      v-model='usersList'
      v-if='selectedUsers.length').authors-list
      v-card(color='success' v-for='user,i in selectedUsers' :key='i').px-3.py-3
        v-layout(justify-space-between)
          v-subheader {{ user.author }}
          v-btn( @click.prevent.stop='removeAuthor(user)' flat icon)
            v-icon close
        p.mb-0 {{ user.role }}
        p.mb-0 Порядок у списку: {{ selectedUsers.indexOf(user) + 1 }}
    v-alert(type='warning' :value='true' v-else) Оберіть виконувачів
</template>

<script>
import draggable from 'vuedraggable'
export default {
  props: {
    selectedUsers: Array
  },
  computed: {
    usersList: {
      get: function () {
        return this.selectedUsers
      },
      set: function (changedList) {
        changedList.map(item => {
        // update canSee
          changedList.indexOf(item) === 0
            ? (item.canSee = 'yes')
            : (item.canSee = 'no')
          return item
        })
        this.$emit('updateSelectedUser', changedList)
      }
    }
  },
  methods: {
    removeAuthor (user) {
      // if we removing first user - second must switch canSee in 'yes' - he will be first after remove current first
      if (this.selectedUsers.indexOf(user) === 0) {
        if (this.selectedUsers[1]) this.selectedUsers[1].canSee = 'yes'
      }
      this.$emit(
        'updateSelectedUser',
        this.selectedUsers.filter(item => item._id !== user._id)
      )
    }
  },
  components: {
    draggable
  }
}
</script>
