import { showMainMenu } from './cli/menus/main';
import { terminal } from 'terminal-kit';

async function run() {
    terminal.clear();
    showMainMenu();
}

run();
