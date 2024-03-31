const util = require('util');
const { exec } = require('child_process');
const fs = require('fs').promises; // Using fs.promises for async file operations
const path = require('path');

const execPromise = util.promisify(exec);

async function checkIfDirectoryExists(directory) {
    try {
        // Check if the directory exists
        await fs.access(directory);
        return true; // Directory exists
    } catch (error) {
        return false; // Directory does not exist
    }
}

async function searchAndExecuteCodeSnippet(searchTerm) {
    const repositoryUrl = 'https://github.com/Dhanusankar/repo7.git';
    const branch = 'main';
    const repoDir = './temp_repo'; // Temporary directory to clone the repository
    
    try {
        // Check if the repository directory already exists
        const repoExists = await checkIfDirectoryExists(repoDir);
        
        // If the repository directory exists, delete it
        if (repoExists) {
            console.log(`Repository directory "${repoDir}" already exists. Deleting...`);
            await removeDirectory(repoDir);
            console.log(`Repository directory "${repoDir}" deleted successfully.`);
        }

        // Clone the repository
        console.log(`Cloning repository from ${repositoryUrl}...`);
        await execPromise(`git clone --branch ${branch} ${repositoryUrl} ${repoDir}`);
        console.log(`Repository cloned successfully to ${repoDir}.`);

        // Search for the code snippet
        const snippetPath = await searchForSnippet(repoDir, searchTerm);
        if (snippetPath) {
            // Read the code snippet file
            const codeSnippet = await fs.readFile(snippetPath, 'utf8');
            
            // Execute the code snippet
            const result = await executeCodeSnippet(codeSnippet);
            console.log('Code snippet executed successfully.');

            return result;
        } else {
            throw new Error('Code snippet not found in the repository.');
        }
    } catch (error) {
        console.error('Error searching for and executing code snippet:', error);
        throw error;
    }
}

async function removeDirectory(directory) {
    try {
        await fs.rmdir(directory, { recursive: true });
        console.log(`Directory "${directory}" removed successfully.`);
    } catch (error) {
        console.error(`Error removing directory ${directory}:`, error);
        throw error;
    }
}

async function searchForSnippet(directory, searchTerm) {
    console.log(`Searching directory: ${directory}`);
    try {
        const files = await fs.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            console.log(`Checking file: ${filePath}`);
            const stat = await fs.stat(filePath);
            if (stat.isDirectory()) {
                console.log(`Directory found: ${filePath}`);
                const result = await searchForSnippet(filePath, searchTerm);
                console.log(`Result from subdirectory: ${result}`);
                if (result) {
                    return result;
                }
            } else {
                console.log(`File found: ${filePath}`);
                const fileContent = await fs.readFile(filePath, 'utf8');
                console.log(`Content: ${fileContent}`);
                if (fileContent.includes(searchTerm)) {
                    console.log(`Search term "${searchTerm}" found in file: ${filePath}`);
                    return filePath;
                }
            }
        }
    } catch (error) {
        console.error(`Error searching for snippet in directory ${directory}:`, error);
        throw error;
    }

    return null;
}

async function executeCodeSnippet(codeSnippet) {
    try {
        // Sanitize the code snippet before executing it
        const sanitizedCodeSnippet = codeSnippet.trim(); // Trim leading and trailing whitespace
        const result = eval(sanitizedCodeSnippet);
        console.log("Execution result:", result);
        return result;
    } catch (error) {
        console.error('Error executing code snippet:', error);
        throw error;
    }
}

module.exports = { searchAndExecuteCodeSnippet };
