import { Choice, Vocabulary } from '../types';

export function formatPhraseChoice(vocab: Vocabulary): Choice {
    return {
        name: vocab.phrase,
        value: vocab.id
    };
}

export function formatPhrasesChoices(vocabulary: Vocabulary[]): Choice[] {
    return vocabulary.map(formatPhraseChoice);
}

export function formatChoicesToReview(vocabulary: Vocabulary[]): Choice[] {
    const expiredChoice = {
        name: 'EXPIRED',
        value: null,
        disabled: true
    };

    const todaysChoice = {
        name: 'TODAY',
        value: null,
        disabled: true
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMidnight = today.valueOf();
    const expiredChoices: Choice[] = [];
    const todaysChoices: Choice[] = [];

    for (const vocab of vocabulary) {
        const choice = formatPhraseChoice(vocab);

        const reviewDate = new Date(vocab.reviewDate).valueOf();

        if (reviewDate < todayMidnight) {
            expiredChoices.push(choice);
        } else {
            todaysChoices.push(choice);
        }
    }

    return [expiredChoice, ...expiredChoices, todaysChoice, ...todaysChoices];
}
