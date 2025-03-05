import { showMainMenu } from './cli/menus/main/main';
import { terminal } from 'terminal-kit';

export async function run() {
    terminal.clear();
    showMainMenu();
}

run();
