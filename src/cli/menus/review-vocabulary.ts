import terminal from '../../terminal';
import store from '../../data/store';
import newVocabularyToLearn from './new-vocabulary-to-learn';
import { getTodaysDay } from '../../utils/dates';
import { getLearnedVocabularyToday } from '../../services/vocabulary-service';
import { goBack } from '../commands/general';
import { showMainMenu } from './main';

const settings = store.get('settings');

export default async function reviewVocabulary() {
    try {
        const todaysDay = getTodaysDay();
        const { daysToLearn, daysToReview } = settings;

        if (daysToLearn.includes(todaysDay)) {
            // Load new Vocabulary to learn

            await getLearnedVocabularyToday();
            const vocabularyLearnedToday = store.get('vocabularyLearnedToday');

            let nVocabulary = store.get('settings').vocabularyPerDay;
            nVocabulary = nVocabulary - vocabularyLearnedToday.length;

            if (nVocabulary <= 0) {
                terminal.blue(
                    `You have already learned ${vocabularyLearnedToday.length} vocabulary today \n`
                );
                showMainMenu();
            } else {
                store.set('menuHistory', [reviewVocabulary]);
                newVocabularyToLearn(nVocabulary);
            }
        } else if (daysToReview.includes(todaysDay)) {
            // Load new Vocabulary to review
        } else {
            terminal.blue('Today there is no vocabulary to review.');
        }
    } catch (error) {
        terminal.red(error);
    }
}
