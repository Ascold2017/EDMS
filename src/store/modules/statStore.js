import { Api } from './../../Api/Api';
import usersStore from './usersStore';
import { store } from '../index';
const statStore = {
    namespaced: true,
    state: {
        docs: [],
    },
    getters: {
        docsCreated(state) {
            return state.docs.length;
        },
        docsSigned(state) {
            return state.docs.filter(doc => doc.globalStatus === 'resolved');
        },
        docsRejected(state) {
            return state.docs.filter(doc => doc.globalStatus === 'archived');
        },
    },
    actions: {
        getDocsStat(context, dateRange) {
            return Api.statApi.getDocsStat(dateRange, store.getters['headerToken'])
                .then(response => { context.state.docs = response; })
                .catch(e => console.error(e.message));
        },
    },
};

export default statStore;
