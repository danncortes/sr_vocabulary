import { Settings, Stage, Vocabulary } from '../types';

type Data = {
    vocabulary: Vocabulary[];
    reviewedToday: number;
    vocabularyDicc: { [key: string]: Vocabulary };
    selectedPhraseId: number | null;
    menuHistory: Function[];
    vocabularyLearnedToday: Partial<Vocabulary>[];
    vocabularyReviewedToday: Partial<Vocabulary>[] | null;
    vocabularyDoneToday: Partial<Vocabulary>[] | null;
    settings: Settings;
    stages: Stage[];
};

class Store {
    private static instance: Store;
    private data: Data;
    private constructor() {
        this.data = {
            vocabulary: [],
            vocabularyDicc: {},
            selectedPhraseId: null,
            reviewedToday: 0,
            menuHistory: [],
            vocabularyLearnedToday: [],
            vocabularyReviewedToday: null,
            vocabularyDoneToday: null,
            stages: [
                {
                    id: 0,
                    days: 0
                },
                {
                    id: 1,
                    days: 2
                },
                {
                    id: 2,
                    days: 7
                },
                {
                    id: 3,
                    days: 14
                },
                {
                    id: 4,
                    days: 28
                },
                {
                    id: 5,
                    days: 56
                }
            ],
            settings: {
                interfaceLanguageId: 1,
                motherLanguageId: 3,
                learningLanguageId: 4,
                vocabularyPerDay: 12,
                daysToLearn: ['Monday', 'Tuesday'],
                daysToReview: ['Wednesday', 'Thursday']
            }
        };
    }
    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }
    public set<K extends keyof Data>(key: K, value: Data[K]): void {
        if (key === 'menuHistory') {
            this.data.menuHistory = [
                ...this.data.menuHistory,
                ...(value as Function[])
            ];
        } else {
            this.data[key] = value;
        }
        if (key === 'vocabulary') {
            for (const phrase of value as Vocabulary[]) {
                this.data.vocabularyDicc[phrase.id] = phrase;
            }
        }
    }
    public get<K extends keyof Data>(key: K): Data[K] {
        return this.data[key];
    }

    public getSelectedVocabulary(): Vocabulary | null {
        if (
            this.data.selectedPhraseId &&
            this.data.vocabularyDicc[this.data.selectedPhraseId]
        ) {
            return this.data.vocabularyDicc[this.data.selectedPhraseId];
        }
        return null;
    }
}

const store = Store.getInstance();

export default store;
