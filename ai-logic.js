// Titan AI: Fitness and Nutrition Assistant

const prompts = {
    greeting: "Hello! I'm Titan AI, your fitness and nutrition assistant. How can I help you today?",
    help: "I can calculate BMI, bench press max, daily caloric needs, and more. Please provide specific inputs like 'Calculate BMI for 125 lbs, 5 ft 7 in'.",
    bmiRequest: "To calculate BMI, provide your weight (lbs or kg) and height (feet/inches or cm). Example: '125 lbs, 5 ft 7 in'.",
    benchPressRequest: "To estimate bench press max, provide reps and weight. Example: '5 reps at 100 lbs'.",
    caloricNeedsRequest: "To calculate caloric needs, provide weight (lbs or kg), height (cm or ft/in), age, and gender. Example: '125 lbs, 5 ft 7 in, 20 years, male'.",
    error: "I'm sorry, I couldn't understand that. Please try rephrasing or provide more details.",
};

function detectIntent(input) {
    input = input.toLowerCase();
    if (input.includes("bmi")) return "bmi";
    if (input.includes("bench press") || input.includes("estimate bench")) return "benchPress";
    if (input.includes("caloric needs") || input.includes("calories")) return "caloricNeeds";
    return "unknown";
}

function parseUnits(input) {
    const weightMatch = input.match(/(\d+\.?\d*)\s*(lbs|kg)/);
    const heightMatch = input.match(/(\d+)\s*ft\s*(\d+)?\s*in|((\d+\.?\d*)\s*(cm|in))/);
    const repsMatch = input.match(/(\d+)\s*reps/);
    const ageMatch = input.match(/(\d+)\s*years/);
    const genderMatch = input.match(/male|female/i);

    let height = null;
    if (heightMatch) {
        if (heightMatch[1] && heightMatch[2]) {
            // Height in ft and in
            height = { value: parseFloat(heightMatch[1]) * 12 + parseFloat(heightMatch[2]), unit: "in" };
        } else if (heightMatch[4] && heightMatch[6]) {
            // Height in cm or inches only
            height = { value: parseFloat(heightMatch[4]), unit: heightMatch[6] };
        }
    }

    return {
        weight: weightMatch ? { value: parseFloat(weightMatch[1]), unit: weightMatch[2] } : null,
        height: height,
        reps: repsMatch ? parseInt(repsMatch[1], 10) : null,
        age: ageMatch ? parseInt(ageMatch[1], 10) : null,
        gender: genderMatch ? genderMatch[0].toLowerCase() : null,
    };
}

function calculateBMI(weight, height) {
    const weightKg = weight.unit === "lbs" ? weight.value * 0.453592 : weight.value;
    const heightM = height.unit === "cm" ? height.value / 100 : height.value * 0.0254;
    return (weightKg / (heightM ** 2)).toFixed(2);
}

function estimateBenchPress(reps, weight) {
    return (weight.value * (1 + reps / 30)).toFixed(2);
}

function calculateCaloricNeeds(weight, height, age, gender) {
    const weightKg = weight.unit === "lbs" ? weight.value * 0.453592 : weight.value;
    const heightCm = height.unit === "in" ? height.value * 2.54 : height.value;

    const bmr = gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    return Math.round(bmr * 1.55); // Moderate activity multiplier
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
            if (parsed.weight && parsed.reps) {
                const benchMax = estimateBenchPress(parsed.reps, parsed.weight);
                return `Your estimated bench press max is ${benchMax} lbs.`;
            } else {
                return prompts.benchPressRequest;
            }
        case "caloricNeeds":
            if (parsed.weight && parsed.height && parsed.age && parsed.gender) {
                const calories = calculateCaloricNeeds(parsed.weight, parsed.height, parsed.age, parsed.gender);
                return `Your estimated daily caloric needs are ${calories} kcal.`;
            } else {
                return prompts.caloricNeedsRequest;
            }
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
console.log(handleInput("Calculate BMI for 125 lbs, 5 ft 7 in"));
console.log(handleInput("Estimate bench for 5 reps at 100 lbs"));
console.log(handleInput("Calculate caloric needs for 125 lbs, 5 ft 7 in, 20 years, male"));
