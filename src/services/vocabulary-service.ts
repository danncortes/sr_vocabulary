import {
    queryNewVocabularyToLearn,
    queryVocabularyToReview,
    queryVocabularyLearnedToday,
    storePhrase,
    storePhraseTranslations,
    updatePhraseTranslation
} from './../queries/queries';
import { Phrase, PhraseTranslations, Vocabulary } from '../types';
import { terminal } from 'terminal-kit';
import store from '../data/store';
import { ResultSetHeader } from 'mysql2';
import {
    addDaysToDate,
    getFormatedDate,
    getNextDateByDay,
    getTodaysDay,
    isDateLessOrEqualThanToday
} from '../utils/dates';

export const getVocabularyToReview = async () => {
    try {
        const vocabulary = (await queryVocabularyToReview()) as Vocabulary[];
        store.set('vocabulary', vocabulary);
        return vocabulary;
    } catch (err) {
        terminal.red(err);
        throw err;
    }
};

export const getNewVocabulary = async (limit: number) => {
    try {
        const vocabulary = (await queryNewVocabularyToLearn(
            limit
        )) as Vocabulary[];
        store.set('vocabulary', vocabulary);
        return vocabulary;
    } catch (err) {
        terminal.red(err);
        throw err;
    }
};

export async function saveTranslatedPhrases(phrases: Phrase[]) {
    try {
        const [learningPhrase, motherPhrase] = phrases;

        const resLearningPhrase = (await storePhrase(
            learningPhrase
        )) as ResultSetHeader;
        const resMotherPhrase = (await storePhrase(
            motherPhrase
        )) as ResultSetHeader;

        await storePhraseTranslations({
            phrase_id: resMotherPhrase.insertId,
            translated_phrase_id: resLearningPhrase.insertId,
            learned: 0,
            sr_stage_id: 0,
            review_date: null
        });
    } catch (error) {
        terminal.red(error, 'There was an error saving the translated phrases');
    }
}

export async function getLearnedVocabularyToday() {
    try {
        const vocabularyLearnedToday =
            (await queryVocabularyLearnedToday()) as Partial<Vocabulary>[];

        store.set('vocabularyLearnedToday', vocabularyLearnedToday);
        return vocabularyLearnedToday;
    } catch (error) {
        terminal.red(error);
    }
}

export async function markVocabularyAsLearnedToday(): Promise<
    Partial<PhraseTranslations>
> {
    try {
        const settings = store.get('settings');
        const { daysToLearn, daysToReview } = settings;
        const selectedVocabulary = store.getSelectedVocabulary()!;

        const todaysDay = getTodaysDay();

        const nextStage = store
            .get('stages')
            .find((stage) => stage.id === selectedVocabulary.stageId + 1);

        const newStageId = selectedVocabulary.stageId + 1;
        let today = new Date().toISOString().split('T')[0];
        //today = selectedVocabulary.reviewDate || today;

        let newReviewDate: string | null;

        if (
            (selectedVocabulary.stageId === 0 &&
                daysToLearn.includes(todaysDay)) ||
            (selectedVocabulary.reviewDate !== null &&
                isDateLessOrEqualThanToday(selectedVocabulary.reviewDate) &&
                daysToReview.includes(todaysDay))
        ) {
            if (nextStage) {
                newReviewDate = addDaysToDate(today, nextStage.days);
            }
        } else {
            let reviewDate: string;
            // If its a new Vocabulary and it is not time to learn it yet
            if (selectedVocabulary.stageId === 0) {
                reviewDate = getNextDateByDay(daysToLearn[0]);
            } else {
                // This is a vocabulary to be reviewed in the future
                reviewDate = getNextDateByDay(daysToReview[0]);
            }

            newReviewDate = addDaysToDate(reviewDate, nextStage!.days);
        }

        const updatedPhraseTranslation: Partial<PhraseTranslations> = {
            id: selectedVocabulary.id,
            learned: newStageId === 6 ? 1 : 0,
            sr_stage_id: newStageId === 6 ? null : newStageId,
            review_date: newReviewDate!
        };
        await updatePhraseTranslation(updatedPhraseTranslation);
        return updatedPhraseTranslation;
    } catch (error) {
        throw error;
    }
}
