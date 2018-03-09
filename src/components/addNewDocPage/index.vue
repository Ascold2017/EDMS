<template lang="pug">
b-container
    b-row
        b-col
            b-card(class="mb-3")
                h1.title Добавить новый документ
                app-timer(@dateUpdate="dateUpd")
    b-row
        b-col
            b-form(@submit.prevent.stop="addNewDoc" enctype="multipart/form-data")
                b-row
                    b-col(md="12" lg="6")
                        b-card
                            b-form-group(
                                    label="Название документа:"
                                    label-for="docname"
                                    description="Добавьте название документа")
                                b-form-input(
                                    id="docname"
                                    type="text"
                                    v-model="docName"
                                    required
                                    placeholder="Введите название документа")
                            b-form-group(
                                label="Файл:"
                                label-for="file"
                                description="Добавьте файл документа")
                                b-form-file(
                                    id="file"
                                    @change="getFile($event)"
                                    choose-label="Выберите файл"
                                    accept=".pdf"
                                    ref="fileInput"
                                    required)
                            pdfReader(
                                :src="previewDoc"
                                v-if="previewDoc")
                            .empty-pdf(v-else)
                                | Загрузите файл документа

                            b-form-group(
                                label="Введите краткое описание документа"
                                class="mt-3"
                                )   
                                b-form-textarea(
                                    v-model="docDescription"
                                    placeholder="Описание.."
                                    :rows="3"
                                    :max-rows="6"
                                    )
                        
                    b-col(md="12" lg="6")
                        preset-routes(@choosePreset="updateSelectedUser")
                        choose-authors(:selectedUsers="selectedUsers" @updateSelectedUsers="updateSelectedUser")

                b-row(class="mt-3")
                    b-col
                        b-card
                            authors-list(:selectedUsers="selectedUsers" @updateSelectedUser="updateSelectedUser")

                b-button(type="submit" class="mt-3" ref="submit") Опубликовать

        b-modal(ref="alertModal" hide-footer) {{ infoAlert }}
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      date: "",
      docName: "",
      docVersion: "1.0.0",
      docDescription: "",
      file: "",
      selectedUsers: [],
      infoAlert: "",
      previewDoc: "",
      percentLoaded: 0
    };
  },
  computed: {
    ...mapGetters("usersStore", ["currentUser"])
  },
  methods: {
    ...mapActions("docsStore", ["addNewDocument"]),
    ...mapActions("usersStore", ["getAllUsersFromGroup"]),
    dateUpd(newDate) {
      this.date = newDate;
    },
    getFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      // check size file
      if (file.size / 1024 > 50000) {
        this.showAlert("Загружаемый файл должен быть меньше 50 МБ!");
        return;
      }
      // save to send on server
      this.file = file;
      this.previewDoc = `${URL.createObjectURL(file)}`;
    },
    updateSelectedUser(users) {
      this.selectedUsers = users;
    },
    addNewDoc(e) {
      if (!this.selectedUsers.length) {
        this.showAlert("Укажите исполнителей!");
        return;
      }
      if (!this.docDescription) {
        this.showAlert("Укажите описание!");
        return;
      }
      this.$refs.submit.disabled = true;
      const formData = new FormData();
      formData.append("title", this.docName);
      formData.append("date", Date.now());
      formData.append("author", this.currentUser.author);
      formData.append("author_id", this.currentUser._id);
      formData.append("total", this.selectedUsers.length);
      formData.append("groupToken", this.currentUser.groupInvite);
      formData.append("routes", JSON.stringify(this.selectedUsers));
      formData.append("file", this.file);
      formData.append("version", this.docVersion);
      formData.append("description", this.docDescription);

      this.addNewDocument(formData)
        .then(response => {
          this.showAlert(response.message);
          e.target.reset();
          this.$refs.fileInput.reset();
          this.selectedUsers = [];
          this.previewDoc = "";
          this.$refs.submit.disabled = false;
        })
        .catch(e => {
          console.log(e);
          this.showAlert(e.message);
        });
    },
    showAlert(title) {
      this.infoAlert = title;
      this.$refs.alertModal.show();
    }
  },
  created() {
    this.getAllUsersFromGroup();
  },
  components: {
    chooseAuthors: require("./innerComponents/chooseAuthors"),
    authorsList: require("./innerComponents/authorsList.vue"),
    appTimer: require("./innerComponents/timer.vue"),
    presetRoutes: require("./innerComponents/presetRoutes"),
    pdfReader: require("../_common/pdf-reader")
  }
};
</script>


