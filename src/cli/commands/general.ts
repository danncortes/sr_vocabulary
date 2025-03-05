import { terminal } from 'terminal-kit';
import store from '../../data/store';
import { Vocabulary } from '../../types';
import playMp3 from '../../utils/play-mp3';
import { markVocabularyAsLearnedToday } from '../../services/vocabulary-service';

export function revealTranslation(): void {
    const selectedVocabulary = store.getSelectedVocabulary();
    if (selectedVocabulary) {
        terminal.blue(selectedVocabulary.translation + '\n');
    }
}

export function goBack() {
    terminal.clear();
    let menuHistory = store.get('menuHistory');
    console.log('🚀 ~ goBack ~ menuHistory:', menuHistory);
    if (menuHistory.length) {
        menuHistory[menuHistory.length - 1]();
        menuHistory.pop();
    } else {
        terminal.red('There is no previous menu to go back to\n');
    }
}

function playPhrase(vocabulary: Vocabulary | null, prop: string) {
    if (vocabulary) {
        if (vocabulary[prop as keyof Vocabulary]) {
            playMp3(vocabulary[prop as keyof Vocabulary] as Buffer);
        } else {
            terminal.red('No audio available for this phrase\n');
        }
    } else {
        terminal.red('There is no selected phrase');
    }
}

export async function playMotherPhrase() {
    const selectedVocabulary = store.getSelectedVocabulary();
    playPhrase(selectedVocabulary, 'phraseAudio');
}

export async function playTranslatedPhrase() {
    const selectedVocabulary = store.getSelectedVocabulary();
    playPhrase(selectedVocabulary, 'translationAudio');
}

export async function setVocabularyAsLearnedToday() {
    const selectedVocabulary = store.getSelectedVocabulary();
    if (selectedVocabulary) {
        try {
            const updatedVocabulary = await markVocabularyAsLearnedToday();

            const { sr_stage_id, review_date } = updatedVocabulary;
            goBack();
            terminal.green(
                `Vocabulary marked as learned today: Stage ${sr_stage_id} - Next review Date: ${review_date} \n`
            );
        } catch (error) {
            goBack();
            terminal.red('Error marking vocabulary as learned today\n');
        }
    }
}
