import { getVocabularyToReview } from '../../services/vocabulary-service';
import store from '../../data/store';
import { goBack } from '../commands/general';
import { terminal } from 'terminal-kit';
import { showVocabulary } from './show-vocabulary';

export async function vocabularyToReview() {
    const vocabulary = await getVocabularyToReview();
    if (vocabulary.length === 0) {
        goBack();
        terminal.green('\n No vocabulary left to review today \n');
        return;
    }

    const selectedPhrase = await showVocabulary(
        vocabulary,
        'Select a new phrase to learn'
    );

    if (selectedPhrase !== null) {
        store.set('menuHistory', [vocabularyToReview]);
    }
}
