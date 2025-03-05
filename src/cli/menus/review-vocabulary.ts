import terminal from '../../terminal';
import store from '../../data/store';
import newVocabularyToLearn from './new-vocabulary-to-learn';
import { getTodaysDay } from '../../utils/dates';
import { getLearnedVocabularyToday } from '../../services/vocabulary-service';
import { vocabularyToReview } from './vocabulary-to-review';
import { goBack } from '../commands/general';

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

            // If the remaining vocabulary to learn is 0, show a message
            if (nVocabulary <= 0) {
                terminal.blue(
                    `You have already learned ${vocabularyLearnedToday.length} vocabulary today \n`
                );
                goBack();
            } else {
                // Show the remaining vocabulary to learn
                newVocabularyToLearn(nVocabulary);
            }
        } else if (daysToReview.includes(todaysDay)) {
            vocabularyToReview();
        } else {
            terminal.blue('Today there is no vocabulary to review.');
        }
    } catch (error) {
        terminal.red(error);
    }
}
