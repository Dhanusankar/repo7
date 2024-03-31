const util = require('util');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

async function searchAndExecuteCodeSnippet(searchTerm) {
    const repositoryUrl = 'https://github.com/Dhanusankar/repo7.git';
    const branch = 'main';
    const repoDir = './temp_repo'; // Temporary directory to clone the repository
    
    try {
        // Clone the repository
        await execPromise(`git clone --branch ${branch} ${repositoryUrl} ${repoDir}`);

        // Search for the code snippet
        const snippetPath = await searchForSnippet(repoDir, searchTerm);
        if (snippetPath) {
            // Read the code snippet file
            const codeSnippet = await fs.readFile(snippetPath, 'utf8');
            
            // Execute the code snippet
            const result = await executeCodeSnippet(codeSnippet);
            
            // Cleanup: Delete temporary directory after fetching code snippet
            await fs.rm(repoDir, { recursive: true, force: true });

            return result;
        } else {
            throw new Error('Code snippet not found in the repository.');
        }
    } catch (error) {
        console.error('Error searching for and executing code snippet:', error);
        throw error;
    }
}

async function searchForSnippet(directory, searchTerm) {
    const files = await fs.readdir(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            const result = await searchForSnippet(filePath, searchTerm);
            if (result) {
                return result;
            }
        } else if (file.includes(searchTerm)) {
            return filePath;
        }
    }

    return null;
}

async function executeCodeSnippet(codeSnippet) {
    try {
        const result = eval(codeSnippet);
        return result;
    } catch (error) {
        console.error('Error executing code snippet:', error);
        throw error;
    }
}

module.exports = { searchAndExecuteCodeSnippet };
