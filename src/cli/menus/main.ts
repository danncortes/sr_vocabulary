import { select } from '@inquirer/prompts';
import reviewVocabulary from './review-vocabulary';
import saveTranslatedPhrasesFromJson from '../../utils/save-phrases-from-json';
import store from '../../data/store';
import newVocabularyToLearn from './new-vocabulary-to-learn';
import { terminal } from 'terminal-kit';

export async function showMainMenu() {
    const choices = [
        { name: 'Review', value: 0 },
        { name: 'Learn new', value: 1 },
        { name: 'See next', value: 2 },
        { name: 'Add new', value: 3 },
        { name: 'Delay all', value: 4 },
        { name: 'Load Phrases from JSON', value: 5 },
        { name: 'Exit', value: 6 }
    ];

    const answer = await select({
        message: 'What would you like to do with your vocabulary today?',
        choices
    });

    store.set('menuHistory', [showMainMenu]);

    switch (answer) {
        case 0:
            terminal.clear();
            reviewVocabulary();
            break;
        case 1:
            terminal.clear();
            newVocabularyToLearn();
            break;
        case 5:
            saveTranslatedPhrasesFromJson();
            break;
        default:
            process.exit();
    }
}
