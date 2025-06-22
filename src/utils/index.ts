import { createHash } from 'crypto';

export function generateChecksum(content: string): string {
    const header = `blob ${Buffer.byteLength(content)}\0`;
    const store = header + content;

    const hash = createHash('sha1');
    hash.update(store);
    return hash.digest('hex');
}
