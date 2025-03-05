import db from '../config/database';
import { Phrase, PhraseTranslations } from '../types';

export const queryVocabularyToReview = async () => {
    const query = `
                SELECT 
                    t.id AS id,
                    p1.text AS phrase,
                    p2.text AS translation,
                    t.sr_stage_id AS stageId,
                    t.review_date AS reviewDate,
                    p1.audio AS phraseAudio,
                    p2.audio AS translationAudio
                    FROM phrase_translations t
                    JOIN phrases p1 ON t.phrase_id = p1.id
                    JOIN phrases p2 ON t.translated_phrase_id = p2.id
                    WHERE DATE(t.review_date) <= CURDATE()
                    AND t.learned = 0
                    AND t.sr_stage_id > 0
            `;

    const [row] = await db.query(query);
    return row;
};

export const queryNewVocabularyToLearn = async (limit: number) => {
    const query = `
                SELECT 
                    t.id AS id,
                    p1.text AS phrase,
                    p2.text AS translation,
                    t.sr_stage_id AS stageId,
                    t.review_date AS reviewDate,
                    p1.audio AS phraseAudio,
                    p2.audio AS translationAudio
                    FROM phrase_translations t
                    JOIN phrases p1 ON t.phrase_id = p1.id
                    JOIN phrases p2 ON t.translated_phrase_id = p2.id
                    WHERE t.review_date IS NULL
                    AND t.learned = 0
                    LIMIT ${limit}
            `;

    const [row] = await db.query(query);
    return row;
};

export const getTranslatedPhraseWithHighestDate = async () => {
    const query = `
                SELECT 
                    MAX(t.review_date) as review_date
                    FROM phrase_translations t
            `;

    const [row] = await db.query(query);
    return row;
};

export async function storePhrase(phrase: Phrase) {
    try {
        const { language_id, text } = phrase;
        const query = `
                    INSERT INTO phrases (language_id, text)
                    VALUES (?, ?)
                `;

        const [row] = await db.query(query, [language_id, text]);
        return row;
    } catch (error) {
        throw error;
    }
}

export async function storePhraseTranslations(
    phrase: Partial<PhraseTranslations>
) {
    try {
        const {
            phrase_id,
            translated_phrase_id,
            learned,
            sr_stage_id,
            review_date
        } = phrase;
        const query = `
                    INSERT INTO phrase_translations (phrase_id, translated_phrase_id, learned, sr_stage_id, review_date)
                    VALUES (?,?,?,?,?)
                `;

        const [row] = await db.query(query, [
            phrase_id,
            translated_phrase_id,
            learned,
            sr_stage_id,
            review_date
        ]);
        return row;
    } catch (error) {
        throw error;
    }
}

export async function updatePhraseTranslation(
    phrase: Partial<PhraseTranslations>
) {
    try {
        const { id, learned, sr_stage_id, review_date } = phrase;

        const query = `
                    UPDATE phrase_translations
                    SET sr_stage_id = ?, review_date = ?, learned = ?
                    WHERE id = ${id}
                `;

        const [row] = await db.query(query, [
            sr_stage_id,
            review_date,
            learned
        ]);
        return row;
    } catch (error) {
        throw error;
    }
}

export const queryVocabularyDoneToday = async () => {
    const query = `
                SELECT 
                    t.id AS id,
                    p1.text AS phrase,
                    p2.text AS translation,
                    t.sr_stage_id AS stageId,
                    t.review_date AS reviewDate,
                    FROM phrase_translations t
                    JOIN phrases p1 ON t.phrase_id = p1.id
                    JOIN phrases p2 ON t.translated_phrase_id = p2.id
                    WHERE DATE(t.modified_at) = CURDATE()
                    LIMIT 100
            `;

    const [row] = await db.query(query);
    return row;
};

export const queryVocabularyLearnedToday = async () => {
    const query = `
                SELECT 
                    t.id AS id,
                    p1.text AS phrase,
                    p2.text AS translation,
                    t.sr_stage_id AS stageId,
                    t.review_date AS reviewDate
                    FROM phrase_translations t
                    JOIN phrases p1 ON t.phrase_id = p1.id
                    JOIN phrases p2 ON t.translated_phrase_id = p2.id
                    WHERE DATE(t.modified_at) = CURDATE()
                    AND t.sr_stage_id = 1
                    LIMIT 100
            `;

    const [row] = await db.query(query);
    return row;
};

export const queryVocabularyReviewedToday = async () => {
    const query = `
                SELECT 
                    t.id AS id,
                    p1.text AS phrase,
                    p2.text AS translation,
                    t.sr_stage_id AS stageId,
                    t.review_date AS reviewDate,
                    FROM phrase_translations t
                    JOIN phrases p1 ON t.phrase_id = p1.id
                    JOIN phrases p2 ON t.translated_phrase_id = p2.id
                    WHERE DATE(t.modified_at) = CURDATE()
                    AND t.sr_stage_id > 1
                    LIMIT 100
            `;

    const [row] = await db.query(query);
    return row;
};
