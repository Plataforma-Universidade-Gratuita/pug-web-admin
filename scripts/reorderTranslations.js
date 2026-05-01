const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

/**
 * Recursively reorder JSON object keys by ASCII value
 * @param {Object} obj - JSON object
 * @returns {Object} - New object with sorted keys
 */
function reorderKeys(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj; // Return if it's not an object or is null
    }

    // Sort keys at the current level
    const sortedObj = {};
    const sortedKeys = Object.keys(obj).sort((a, b) => a.localeCompare(b));

    for (const key of sortedKeys) {
        // Recursively sort nested objects
        sortedObj[key] = reorderKeys(obj[key]);
    }

    return sortedObj;
}

/**
 * Reorder JSON keys in a file and write the output to another file
 * @param {string} inputFilePath - Path to the input JSON file
 * @param {string} outputFilePath - Path to the output JSON file
 */
function reorderJsonKeys(inputFilePath, outputFilePath) {
    try {
        // Resolve full paths
        const resolvedInputPath = path.resolve(__dirname, inputFilePath);
        const resolvedOutputPath = path.resolve(__dirname, outputFilePath);

        // Check if input file exists
        if (!fs.existsSync(resolvedInputPath)) {
            console.error(`Input file does not exist: ${resolvedInputPath}`);
            return;
        }

        // Create output directory if it doesn't exist
        const outputDir = path.dirname(resolvedOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Read and parse the input JSON file
        const rawData = fs.readFileSync(resolvedInputPath, "utf8");
        const jsonData = JSON.parse(rawData);

        // Reorder keys
        const reorderedData = reorderKeys(jsonData);

        // Write the reordered JSON to the output file
        fs.writeFileSync(resolvedOutputPath, JSON.stringify(reorderedData, null, 4), "utf8");
    } catch (error) {
        console.error("Error processing JSON:", error.message);
    }
}

// Paths to input JSON files
const inputAndOutputFiles = [
    "../public/locales/en-US/common.json",
    "../public/locales/pt-BR/common.json",
];

function isDev() {
    return process.argv.includes("dev");
}

/**
 * Check if there are any git changes in the repository
 * @returns {boolean} - True if there are changes, false otherwise
 */
function hasGitChanges() {
    try {
        const result = execSync("git status --porcelain", { encoding: "utf8" });
        return result.trim().length > 0;
    } catch (error) {
        console.error("Error checking git status:", error.message);
        return false;
    }
}

// Process each file
inputAndOutputFiles.forEach(file => {
    reorderJsonKeys(file, file);
});

if (hasGitChanges() && !isDev()) {
    throw new Error("Git changes detected! Run npm run trans and commit your changes."
        + "\nExiting pipeline...");
}