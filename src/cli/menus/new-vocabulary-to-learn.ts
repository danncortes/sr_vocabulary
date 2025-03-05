import store from '../../data/store';
import { getNewVocabulary } from '../../services/vocabulary-service';
import { showVocabulary } from './show-vocabulary';

export default async function newVocabularyToLearn(nVocabularyToLean?: number) {
    const settings = store.get('settings');
    const { vocabularyPerDay } = settings;

    const nVocabularyToRequest =
        nVocabularyToLean === undefined ? vocabularyPerDay : nVocabularyToLean;

    const vocabulary = await getNewVocabulary(nVocabularyToRequest);

    const selectedPhrase = await showVocabulary(
        vocabulary,
        'Select a new phrase to learn'
    );

    if (selectedPhrase !== null) {
        if (nVocabularyToLean === undefined) {
            store.set('menuHistory', [newVocabularyToLearn]);
        }
    }
}
