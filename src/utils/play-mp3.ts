import fs from 'fs/promises';
import { file } from 'tmp-promise';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function playMp3(blob: Buffer) {
    const { path } = await file({ postfix: '.mp3' });
    await fs.writeFile(path, blob);

    // Using `ffplay` or `mpg123` (ensure you have either installed)
    try {
        await execPromise(`ffplay -nodisp -autoexit "${path}"`); // ffplay
        // await execPromise(`mpg123 "${path}"`); // Alternative: mpg123
    } catch (error) {
        console.error('Error playing MP3:', error);
    }
}
