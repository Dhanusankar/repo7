function geometricSeriesSum(a, r, n) {
    if (r === 1) {
        // If the common ratio is 1, the series becomes a simple arithmetic series
        return a * n;
    } else {
        // Calculate the sum using the formula
        return (a * (1 - Math.pow(r, n))) / (1 - r);
    }
}

// Example usage
const firstTerm = 2; // First term of the series
const commonRatio = 3; // Common ratio of the series
const numberOfTerms = 4; // Number of terms to sum
const sum = geometricSeriesSum(firstTerm, commonRatio, numberOfTerms);
console.log("Sum of the geometric series:", sum);
