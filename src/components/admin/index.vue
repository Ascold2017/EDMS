<template lang="pug">
    b-container
        section.admin
        h1.title Панель администратора {{ group.name }}
        h2 Создать пользователя
        ol
            li Создать роль
            li Сгенерировать инвайт код пользователя
        h2 Пользователи группы {{ group.name }}
        ol
            li Артистов Юрий Борисович
                p Декан
            li Богдан Игорь Антонович
                p Ректор
            li Васильев Игорь Борисович
                p Доцент
            
</template>

<script>
import { randomizer } from '../modulesJs/randomizer';
export default {
    data() {
        return {
            group: {
                name: 'АБВГД',
                token: 'abcd',
            }
        };
    },
}
</script>
<style lang="sass" scoped>
.admin
    padding: 40px 0
ol
    list-style: inside
</style>

