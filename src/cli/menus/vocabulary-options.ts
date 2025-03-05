import { select, Separator } from '@inquirer/prompts';
import {
    goBack,
    playMotherPhrase,
    playTranslatedPhrase,
    revealTranslation,
    setVocabularyAsLearnedToday
} from '../commands/general';

export async function vocabularyOptions(defaultChoiceIndex?: number) {
    const choices = [
        { name: 'Play', value: 0, description: 'Play phrase audio \n' },
        { name: 'Reveal translation', value: 1 },
        {
            name: 'Play translation',
            value: 2,
            description: 'Play translated phrase audio \n'
        },
        {
            name: 'Mark as done today',
            value: 3,
            description: 'It will send the phrase to the next stage'
        },
        {
            name: 'Mark as learned',
            value: 4,
            description:
                'It will mark the vocabulary as learned and it will not be reviewed again'
        },
        { name: 'Delay', value: null, disabled: true },
        {
            name: '2 Days',
            value: 5,
            description:
                'It will delay the phrase for 2 days. The stages remains'
        },
        {
            name: '7 Days',
            value: 6,
            description:
                'It will delay the phrase for 7 days. The stages remains'
        },
        { name: '14 Days', value: 7 },
        { name: '28 Days', value: 8 },
        new Separator(),
        { name: '< Go back', value: 9 },
        new Separator()
    ];

    const defaultIndex =
        defaultChoiceIndex !== undefined ? defaultChoiceIndex : null;

    const answer = await select({
        message: 'What would you like to do?',
        choices,
        default: defaultIndex
    });

    switch (answer) {
        case 0:
            playMotherPhrase();
            vocabularyOptions();
            break;
        case 1:
            revealTranslation();
            playTranslatedPhrase();
            vocabularyOptions(1);
            break;
        case 2:
            playTranslatedPhrase();
            vocabularyOptions(2);
            break;
        case 3:
            setVocabularyAsLearnedToday();
            break;
        case 9:
            goBack();
            break;
        default:
            goBack();
            break;
    }
}
