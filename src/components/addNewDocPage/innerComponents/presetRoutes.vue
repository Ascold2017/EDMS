<template lang="pug">
    div
        b-form-group(
            label="Выбрать готовый пресет"
            )
            b-form-select(
                v-model="selectedPreset"
                :options="presetsOptions"
                )
        b-form-group(
            label="Создать новый пресет"
            )
            b-btn(type="button" @click="showEditor") Открыть редактор

        b-modal(ref="routesEditor" title="Создать новый пресет маршрута" hide-footer)
            b-form(@submit.prevent.stop="createNewPreset")
                b-form-group(
                    label="Задайте название пресета"
                    )
                    b-form-input(
                        id="presetname"
                        type="text"
                        v-model="presetName"
                        required
                        placeholder="Введите название пресета")
                choose-authors(
                    @updateSelectedUsers="updatePresetRoute"
                    :selectedUsers="selectedUsers"
                    )
                authors-list(:selectedUsers="selectedUsers" @updateSelectedUser="updatePresetRoute")
                b-btn(type="submit") Создать пресет
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    data() {
        return {
            selectedPreset: [],
            selectedUsers: [],
            presetName: '',
        };
    },
    computed: {
        ...mapGetters('docsStore', ['presets']),
        presetsOptions() {
            let result = [{value: [], text: 'Не выбрано'}];
            this.presets.map(preset => {
                result.push({value: preset.routes, text: preset.title });
            });
            return result;
        }
    },
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
    watch: {
        selectedPreset: function() {
            console.log(this.selectedPreset);
            this.$emit('choosePreset', this.selectedPreset);
        }
    },
    created() {
        this.getPresets();
    },
    components: {
        chooseAuthors: require('./chooseAuthors'),
        authorsList: require('./authorsList'),
    },
}
</script>

