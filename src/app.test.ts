import { terminal } from 'terminal-kit';
import { showMainMenu } from './cli/menus/main/main';
import { run } from './app';

jest.mock('./cli/menus/main/main', () => ({
    showMainMenu: jest.fn()
}));

describe('App', () => {
    it('should clear terminal and show main menu', async () => {
        await run();
        expect(terminal.clear).toHaveBeenCalledTimes(1);
        expect(showMainMenu).toHaveBeenCalledTimes(1);
    });
});
