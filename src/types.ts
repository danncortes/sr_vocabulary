export type Choice = {
    value: number | null;
    name?: string;
    description?: string;
    short?: string;
    disabled?: boolean | string;
};

export type Vocabulary = {
    id: number;
    phrase: string;
    translation: string;
    stageId: number;
    reviewDate: string;
    phraseAudio: Buffer<ArrayBufferLike> | null;
    translationAudio: Buffer<ArrayBufferLike> | null;
};

export type Phrase = {
    language_id: number;
    text: string;
    audio?: Buffer<ArrayBufferLike> | null;
};

export type PhraseTranslations = {
    id: number;
    phrase_id: number;
    translated_phrase_id: number;
    learned: number;
    sr_stage_id: number | null;
    review_date: null | string;
    modified_at: string;
};

export type Settings = {
    interfaceLanguageId: number;
    motherLanguageId: number;
    learningLanguageId: number;
    vocabularyPerDay: number;
    daysToLearn: string[];
    daysToReview: string[];
};

export type Days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

export type Stage = {
    id: number;
    days: number;
};
