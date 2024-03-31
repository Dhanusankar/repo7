const axios = require('axios');

async function searchAndExecuteCodeSnippet(searchTerm) {
    const repositoryOwner = 'Dhanusankar';
    const repositoryName = 'repo7';
    const branch = 'main';
    const operationsDir = 'operations';

    try {
        // Fetch the contents of the operations directory
        const directoryContents = await getDirectoryContents(repositoryOwner, repositoryName, branch, operationsDir);
        console.log("dirrrrrr", directoryContents);
        console.log(searchTerm);

        // Search for the code snippet in the directory contents
        const snippetPath = await searchForSnippetInDirectoryContents(directoryContents, searchTerm);
        if (snippetPath) {
            // Fetch the code snippet file
            const codeSnippet = await getFileContents(repositoryOwner, repositoryName, branch, snippetPath);

            // Execute the code snippet
            const result = await executeCodeSnippet(codeSnippet);
            console.log('Code snippet executed successfully.');
            return result;
        } else {
            throw new Error('Code snippet not found in the "operations" directory of the repository.');
        }
    } catch (error) {
        console.error('Error searching for and executing code snippet:', error);
        throw error;
    }
}

async function getDirectoryContents(owner, repo, branch, path) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const response = await axios.get(url);
    console.log("hanumaaaan", response.data);
    return response.data;
}

async function searchForSnippetInDirectoryContents(directoryContents, searchTerm) {
    for (const item of directoryContents) {
        if (item.type === 'file' && item.name.includes(searchTerm)) {
            console.log("heee", item.path);
            return item.path;
        } else if (item.type === 'dir') {
            const nestedDirectoryContents = await getDirectoryContents(repositoryOwner, repositoryName, branch, item.path);
            const nestedResult = await searchForSnippetInDirectoryContents(nestedDirectoryContents, searchTerm);
            if (nestedResult) {
                console.log("yessss", nestedResult);
                return nestedResult;
            }
        }
    }
    return null;
}

async function getFileContents(owner, repo, branch, path) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const response = await axios.get(url);
    return response.data;
}

async function executeCodeSnippet(codeSnippet) {
    try {
        // Sanitize the code snippet before executing it
        const sanitizedCodeSnippet = codeSnippet.trim(); // Trim leading and trailing whitespace
        console.log("snipppp");
      //  const result = eval(sanitizedCodeSnippet);
      //  console.log("Execution result:", result);
        return sanitizedCodeSnippet;
    } catch (error) {
        console.error('Error executing code snippet:', error);
        throw error;
    }
}

module.exports = { searchAndExecuteCodeSnippet };