// Updated ai-logic.js to address parsing, intent detection, and calculation logic issues

const prompts = {
    greeting: "Hello! I'm Titan AI, your fitness and nutrition assistant. I can calculate BMI, expected bench press, caloric needs, and more! How can I help you today?",
    help: "I can calculate BMI, bench press max, daily caloric needs, one-rep max, and more. What would you like to calculate?",
    error: "I'm not sure I understood that. Could you clarify or ask about workouts, nutrition, calculators, or motivation?",
    bmiRequest: "To calculate BMI, provide your weight (in lbs or kg) and height (in feet/inches or cm). For example: 'Calculate BMI for 125 lbs, 5 ft 7.'",
    benchPressRequest: "To estimate bench press max, provide the number of reps you can do at a specific weight. For example: 'Estimate bench for 10 reps at 100 lbs.'",
    caloricNeedsRequest: "To calculate caloric needs, provide your weight (in lbs or kg), height (in cm or ft/in), age, and gender. For example: 'Calculate calories for 125 lbs, 5 ft 7, 20 years, male.'",
};

function detectIntent(input) {
    input = input.toLowerCase();
    if (input.includes("bmi")) return "bmi";
    if (input.includes("bench press") || input.includes("estimate bench")) return "benchPress";
    if (input.includes("caloric needs") || input.includes("calories")) return "caloricNeeds";
    if (input.includes("one rep max")) return "oneRepMax";
    return "unknown";
}

function parseUnits(input) {
    const weightMatch = input.match(/(\d+\.?\d*)\s*(lbs|kg)/);
    const heightMatch = input.match(/(\d+\.?\d*)\s*(cm|ft|in|')/);
    return {
        weight: weightMatch ? { value: parseFloat(weightMatch[1]), unit: weightMatch[2] } : null,
        height: heightMatch ? { value: parseFloat(heightMatch[1]), unit: heightMatch[2] } : null,
    };
}

function calculateBMI(weight, height) {
    let weightKg = weight.unit === "lbs" ? weight.value * 0.453592 : weight.value;
    let heightM = height.unit === "cm" ? height.value / 100 : height.value * 0.3048;
    return (weightKg / (heightM ** 2)).toFixed(2);
}

function estimateBenchPress(reps, weight) {
    return (weight.value * (1 + reps / 30)).toFixed(2);
}

function generateResponse(intent, input) {
    const parsed = parseUnits(input);

    switch (intent) {
        case "bmi":
            if (parsed.weight && parsed.height) {
                const bmi = calculateBMI(parsed.weight, parsed.height);
                return `Your BMI is approximately ${bmi}.`;
            } else {
                return prompts.bmiRequest;
            }
        case "benchPress":
            const repsMatch = input.match(/(\d+)\s*reps/);
            if (parsed.weight && repsMatch) {
                const reps = parseInt(repsMatch[1], 10);
                const benchMax = estimateBenchPress(reps, parsed.weight);
                return `Your estimated bench press max is ${benchMax} lbs.`;
            } else {
                return prompts.benchPressRequest;
            }
        case "caloricNeeds":
            // Placeholder for caloric needs calculation implementation
            return prompts.caloricNeedsRequest;
        case "unknown":
        default:
            return prompts.error;
    }
}

function handleInput(input) {
    const intent = detectIntent(input);
    return generateResponse(intent, input);
}

// Example Usage
console.log(handleInput("Calculate BMI for 125 lbs, 5 ft 7"));
console.log(handleInput("Estimate bench for 5 reps at 100 lbs"));
console.log(handleInput("Calculate caloric needs for 125 lbs, 5 ft 7, 20 years, male"));
