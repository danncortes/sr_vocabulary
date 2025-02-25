import { select, Separator } from '@inquirer/prompts';
import store from '../../data/store';
import { getNewVocabulary } from '../../services/vocabulary-service';
import { goBack, playMotherPhrase } from '../commands/general';
import { vocabularyOptions } from './vocabulary-options';
import { formatPhrasesChoices } from '../../utils/choices';
import { terminal } from 'terminal-kit';

export default async function newVocabularyToLearn(nVocabularyToLean?: number) {
    const settings = store.get('settings');
    const { vocabularyPerDay } = settings;

    const nVocabularyToRequest =
        nVocabularyToLean === undefined ? vocabularyPerDay : nVocabularyToLean;

    const vocabulary = await getNewVocabulary(nVocabularyToRequest);
    const phrasesChoices = formatPhrasesChoices(vocabulary);

    const choices = [
        ...phrasesChoices,
        new Separator(),
        {
            name: 'Go back',
            value: null
        },
        new Separator()
    ];
    const selectedPhrase = await select({
        message: 'Select a new phrase to learn',
        choices: choices
    });

    if (selectedPhrase !== null) {
        if (nVocabularyToLean === undefined) {
            store.set('menuHistory', [newVocabularyToLearn]);
        }
        store.set('selectedPhraseId', selectedPhrase);
        playMotherPhrase();
        vocabularyOptions();
    } else {
        goBack();
    }
}
