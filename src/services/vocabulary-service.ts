import {
    queryNewVocabularyToLearn,
    queryReviewVocabulary,
    queryVocabularyDoneToday,
    queryVocabularyLearnedToday,
    storePhrase,
    storePhraseTranslations,
    updatePhraseTranslation
} from './../queries/queries';
import { Phrase, PhraseTranslations, Vocabulary } from '../types';
import { terminal } from 'terminal-kit';
import store from '../data/store';
import { ResultSetHeader } from 'mysql2';
import { addDaysToDate, getNextDateByDay, getTodaysDay } from '../utils/dates';
import { goBack } from '../cli/commands/general';

export const getReviewVocabulary = async () => {
    try {
        const vocabulary = (await queryReviewVocabulary()) as Vocabulary[];
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

export async function markVocabularyAsLearnedToday() {
    try {
        const settings = store.get('settings');
        const { daysToLearn, daysToReview } = settings;
        const selectedVocabulary = store.getSelectedVocabulary();

        if (selectedVocabulary) {
            const todaysDay = getTodaysDay();

            const nextStage = store
                .get('stages')
                .find((stage) => stage.id === selectedVocabulary.stageId + 1);

            let today = new Date().toISOString().split('T')[0];
            today = selectedVocabulary.reviewDate || today;

            if (
                (selectedVocabulary.stageId === 0 &&
                    daysToLearn.includes(todaysDay)) ||
                (selectedVocabulary.stageId > 0 &&
                    daysToReview.includes(todaysDay))
            ) {
                if (nextStage) {
                    const newDate = addDaysToDate(today, nextStage.days);

                    const newStageId = selectedVocabulary.stageId + 1;

                    const updatedPhraseTranslation: Partial<PhraseTranslations> =
                        {
                            id: selectedVocabulary.id,
                            learned: newStageId === 6 ? 1 : 0,
                            sr_stage_id: newStageId === 6 ? null : newStageId,
                            review_date: newDate
                        };

                    await updatePhraseTranslation(updatedPhraseTranslation);
                    return updatedPhraseTranslation;
                }
            } else {
                let newDate: null | string = null;
                if (todaysDay === 'Thursday') {
                    newDate = getNextDateByDay(todaysDay);
                } else {
                    newDate = getNextDateByDay('Wednesday');
                }
                console.log(
                    '🚀 ~ markVocabularyAsLearnedToday ~ newDate:',
                    newDate
                );
            }
        }
    } catch (error) {
        terminal.red(error);
    }
}
