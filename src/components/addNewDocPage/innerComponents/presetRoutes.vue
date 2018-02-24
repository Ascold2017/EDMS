<template lang="pug">
    b-card
        b-form-group(
            label="Создать новый маршрут Подписантов"
            )
            b-btn(type="button" @click="showEditor") Открыть редактор

        b-modal(ref="routesEditor" title="Создать новый Маршрут" hide-footer)
            b-form(@submit.prevent.stop="createNewPreset")
                b-form-group(
                    label="Задайте название Маршрута"
                    )
                    b-form-input(
                        id="presetname"
                        type="text"
                        v-model="presetName"
                        required
                        placeholder="Введите название маршрута")
                choose-authors(
                    @updateSelectedUsers="updatePresetRoute"
                    :selectedUsers="selectedUsers"
                    )
                authors-list(:selectedUsers="selectedUsers" @updateSelectedUser="updatePresetRoute")
                b-btn(type="submit") Создать Маршрут
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            selectedUsers: [],
            presetName: '',
        };
    },
    computed: mapGetters('usersStore', ['currentUser']),
    methods: {
        ...mapActions('docsStore', ['createPreset', 'getPresets']),
        showEditor() {
            this.$refs.routesEditor.show();
        },
        updatePresetRoute(selectedUsers) {
            this.selectedUsers = selectedUsers;
        },
        createNewPreset(e) {
            const newPreset = {
                title: this.presetName,
                routes: this.selectedUsers,
                group: this.currentUser.groupInvite,
            }
            this.createPreset(newPreset)
            .then(response => {
                e.target.reset();
                this.selectedUsers = [];
                this.$refs.routesEditor.hide();
                this.getPresets();
            })
            console.log(newPreset);
        }
    },
    components: {
        chooseAuthors: require('./chooseAuthors'),
        authorsList: require('./authorsList'),
    },
}
</script>

