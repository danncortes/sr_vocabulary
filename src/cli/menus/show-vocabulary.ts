import { Separator, select } from '@inquirer/prompts';
import { terminal } from 'terminal-kit';
import store from '../../data/store';
import { Vocabulary } from '../../types';
import { formatPhrasesChoices } from '../../utils/choices';
import { goBack, playMotherPhrase } from '../commands/general';
import { vocabularyOptions } from './vocabulary-options';

export const showVocabulary = async (
    vocabulary: Vocabulary[],
    optionTitle: string
): Promise<number | null | undefined> => {
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
        message: optionTitle,
        choices: choices
    });

    if (selectedPhrase !== null) {
        store.set('selectedPhraseId', selectedPhrase);
        playMotherPhrase();
        vocabularyOptions();
    } else {
        goBack();
    }

    return selectedPhrase;
};
