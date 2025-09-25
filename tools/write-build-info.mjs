#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const outputDir = resolve(projectRoot, 'src/environments');
const outputFile = resolve(outputDir, 'build-info.ts');

function getGitSha() {
    if (process.env.GITHUB_SHA) {
        return process.env.GITHUB_SHA.slice(0, 7);
    }

    try {
        const result = execSync('git rev-parse --short HEAD', {
            cwd: projectRoot,
            stdio: ['ignore', 'pipe', 'ignore'],
        });
        return result.toString().trim();
    } catch (error) {
        return 'unknown';
    }
}

const gitSha = getGitSha();
const generatedAt = new Date().toISOString();

const content = `export const buildInfo = {\n    gitSha: '${gitSha}',\n    generatedAt: '${generatedAt}',\n};\n`;

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, content, 'utf8');

console.log(`build-info.ts updated with gitSha ${gitSha}`);
