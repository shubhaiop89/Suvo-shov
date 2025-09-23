import { Sandbox } from '@e2b/sdk';
import type { FileSystem } from '../types';
import { Buffer } from 'buffer';

export interface SandboxSession {
    sandbox: Sandbox;
    url: string;
}

/**
 * Creates and configures a new E2B sandbox session.
 * This function is self-contained and does not use any global state.
 * The caller is responsible for managing the lifecycle of the returned sandbox instance (e.g., closing it).
 *
 * @param fileSystem The project files to write to the sandbox.
 * @param onLog A callback function to stream logs (stdout, stderr) from the sandbox.
 * @returns A promise that resolves to a SandboxSession object, containing the sandbox instance and its public URL.
 */
export async function createSandboxSession(
    fileSystem: FileSystem,
    onLog: (log: { type: 'stdout' | 'stderr'; line: string }) => void
): Promise<SandboxSession> {
    const apiKey = 'e2b_9c822e0654129a7468427278f27f4df92033db2e';

    if (!apiKey) {
        throw new Error("E2B API key is not configured. This is required for live previews.");
    }

    const sandbox = await Sandbox.create({
        template: 'nodejs',
        apiKey: apiKey,
        onStdout: (log) => onLog({ type: 'stdout', line: log.line }),
        onStderr: (log) => onLog({ type: 'stderr', line: log.line }),
    });

    try {
        // Create directories first to ensure files can be written.
        const dirs = new Set(Object.keys(fileSystem).map(p => p.substring(0, p.lastIndexOf('/'))).filter(Boolean));
        for (const dir of dirs) {
            await sandbox.filesystem.makeDir(dir, { recursive: true });
        }

        // Write all project files to the sandbox.
        for (const [path, data] of Object.entries(fileSystem)) {
            if (data.isBinary) {
                const binaryData = Buffer.from(data.content, 'base64');
                await sandbox.filesystem.write(path, binaryData);
            } else {
                await sandbox.filesystem.write(path, data.content);
            }
        }
        
        const port = 3000;
        
        // Check for package.json to decide which command to run.
        if (fileSystem['package.json']) {
            const installProc = await sandbox.process.start('npm install');
            await installProc.wait;
            
            const pkgJsonContent = fileSystem['package.json'].content;
            const pkg = JSON.parse(pkgJsonContent);
            
            let startCommand = 'npm start';
            if (pkg.scripts?.dev) {
                startCommand = 'npm run dev';
            }
            
            await sandbox.process.start(startCommand);
        } else {
            // No package.json, assume static site and use `serve`
            const serveInstall = await sandbox.process.start('npm install -g serve');
            await serveInstall.wait;
            await sandbox.process.start(`serve -l ${port} .`);
        }

        const url = await sandbox.getURL(port);
        
        return {
            sandbox,
            url,
        };
    } catch (e) {
        await sandbox.close(); // Clean up if setup fails.
        if (e instanceof Error) {
            onLog({ type: 'stderr', line: `Sandbox setup failed: ${e.message}` });
        }
        throw e;
    }
}