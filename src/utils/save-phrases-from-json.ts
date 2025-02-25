import { readFile } from 'fs/promises';
import { terminal } from 'terminal-kit';
import { saveTranslatedPhrases } from '../services/vocabulary-service';
import store from '../data/store';

async function saveTranslatedPhrasesFromJson() {
    try {
        const fileContent = await readFile(
            new URL('../data-to-load.json', import.meta.url),
            'utf8'
        );
        const vocabulary = JSON.parse(fileContent);

        const settings = store.get('settings');
        const { learningLanguageId, motherLanguageId } = settings;

        if (vocabulary.length) {
            for (const phrases of vocabulary) {
                const [learningPhrase, motherPhrase] = phrases;

                const learningPhr = {
                    language_id: learningLanguageId,
                    text: learningPhrase
                };

                const motherPhr = {
                    language_id: motherLanguageId,
                    text: motherPhrase
                };

                await saveTranslatedPhrases([learningPhr, motherPhr]);
            }
            terminal.green('Phrases saved successfully\n');
        }
    } catch (error) {
        terminal.red(error, 'There was an error saving the phrases');
    }
}
export default saveTranslatedPhrasesFromJson;
