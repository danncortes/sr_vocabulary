import { terminal } from 'terminal-kit';
import { select } from '@inquirer/prompts';

// Mock terminal-kit
jest.mock('terminal-kit', () => ({
    terminal: {
        clear: jest.fn(),
        blue: jest.fn(),
        red: jest.fn(),
        green: jest.fn()
    }
}));

// Mock @inquirer/prompts
jest.mock('@inquirer/prompts', () => ({
    select: jest.fn(),
    Separator: jest.fn()
}));

// Reset all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
