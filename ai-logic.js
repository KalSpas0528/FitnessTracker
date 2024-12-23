// Titan AI: Fitness and Nutrition Assistant with Expanded Prompts


//prompts.
const prompts = {
    greeting: "Hello! I'm Titan AI, your fitness and nutrition assistant. Ready to crush your goals today?",
    help: "I can calculate BMI, one-rep max, caloric needs, protein requirements, and much more. Ask me anything about fitness, nutrition, or staying motivated!",
    bmiRequest: "Sure, to calculate BMI, I need your weight (lbs or kg) and height (feet/inches or cm). Example: '125 lbs, 5 ft 7 in'.",
    benchPressRequest: "To estimate your bench press max, I need the reps and weight you lifted. Example: '5 reps at 100 lbs'.",
    caloricNeedsRequest: "To estimate your daily caloric needs, tell me your weight (lbs or kg), height (cm or ft/in), age, and gender. Example: '125 lbs, 5 ft 7 in, 20 years, male'.",
    proteinNeedsRequest: "To calculate your daily protein needs, provide your weight and fitness goal (e.g., muscle gain, maintenance, fat loss). Example: '125 lbs for muscle gain'.",
    hydrationRequest: "To calculate daily water intake, share your weight and activity level (e.g., sedentary, moderate, intense). Example: '125 lbs, moderate activity'.",
    workoutSuggestion: "Need workout advice? I can suggest routines for muscle gain, fat loss, or endurance. Just let me know your goal!",
    motivation: [
        "Every rep counts. Keep going!",
        "The only bad workout is the one you didn’t do.",
        "You’re stronger than you think. Prove it.",
        "Progress, not perfection."
    ],
    error: "Hmm, I didn’t quite catch that. Could you clarify or ask a different way?",
};

function detectIntent(input) {
    input = input.toLowerCase();
    if (input.includes("bmi")) return "bmi";
    if (input.includes("bench press") || input.includes("estimate bench")) return "benchPress";
    if (input.includes("caloric needs") || input.includes("calories")) return "caloricNeeds";
    if (input.includes("protein needs") || input.includes("protein")) return "proteinNeeds";
    if (input.includes("water intake") || input.includes("hydration")) return "hydration";
    if (input.includes("workout")) return "workoutSuggestion";
    if (input.includes("motivate") || input.includes("motivation")) return "motivation";
    return "unknown";
}

function parseUnits(input) {
    const weightMatch = input.match(/(\d+\.?\d*)\s*(lbs|kg)/);
    const heightMatch = input.match(/(\d+)\s*ft\s*(\d+)?\s*in|((\d+\.?\d*)\s*(cm|in))/);
    const repsMatch = input.match(/(\d+)\s*reps/);
    const ageMatch = input.match(/(\d+)\s*years/);
    const genderMatch = input.match(/male|female/i);
    const activityMatch = input.match(/(sedentary|moderate|intense)/i);

    let height = null;
    if (heightMatch) {
        if (heightMatch[1] && heightMatch[2]) {
            height = { value: parseFloat(heightMatch[1]) * 12 + parseFloat(heightMatch[2]), unit: "in" };
        } else if (heightMatch[4] && heightMatch[6]) {
            height = { value: parseFloat(heightMatch[4]), unit: heightMatch[6] };
        }
    }

    return {
        weight: weightMatch ? { value: parseFloat(weightMatch[1]), unit: weightMatch[2] } : null,
        height: height,
        reps: repsMatch ? parseInt(repsMatch[1], 10) : null,
        age: ageMatch ? parseInt(ageMatch[1], 10) : null,
        gender: genderMatch ? genderMatch[0].toLowerCase() : null,
        activity: activityMatch ? activityMatch[1].toLowerCase() : null,
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

function calculateProteinNeeds(weight, goal) {
    const weightKg = weight.unit === "lbs" ? weight.value * 0.453592 : weight.value;
    let factor = goal === "muscle gain" ? 2.0 : goal === "fat loss" ? 1.6 : 1.2;
    return Math.round(weightKg * factor);
}

function calculateWaterIntake(weight, activity) {
    const weightKg = weight.unit === "lbs" ? weight.value * 0.453592 : weight.value;
    let multiplier = activity === "intense" ? 0.05 : activity === "moderate" ? 0.04 : 0.03;
    return (weightKg * multiplier).toFixed(1);
}

function generateResponse(intent, input) {
    const parsed = parseUnits(input);

    switch (intent) {
        case "bmi":
            if (parsed.weight && parsed.height) {
                return `Hmm... calculating... Your BMI is approximately ${calculateBMI(parsed.weight, parsed.height)}.`;
            } else {
                return prompts.bmiRequest;
            }
        case "benchPress":
            if (parsed.weight && parsed.reps) {
                return `Let me think... Okay! Your estimated bench press max is ${estimateBenchPress(parsed.reps, parsed.weight)} lbs.`;
            } else {
                return prompts.benchPressRequest;
            }
        case "caloricNeeds":
            if (parsed.weight && parsed.height && parsed.age && parsed.gender) {
                return `Just a moment... Got it! Your estimated daily caloric needs are ${calculateCaloricNeeds(parsed.weight, parsed.height, parsed.age, parsed.gender)} kcal.`;
            } else {
                return prompts.caloricNeedsRequest;
            }
        case "proteinNeeds":
            if (parsed.weight && parsed.activity) {
                return `Thinking... For your goal, your daily protein needs are around ${calculateProteinNeeds(parsed.weight, parsed.activity)} grams.`;
            } else {
                return prompts.proteinNeedsRequest;
            }
        case "hydration":
            if (parsed.weight && parsed.activity) {
                return `Calculating... You should aim for about ${calculateWaterIntake(parsed.weight, parsed.activity)} liters of water daily.`;
            } else {
                return prompts.hydrationRequest;
            }
        case "workoutSuggestion":
            return `Based on your goal, here’s a suggestion: Focus on compound lifts like squats, deadlifts, and bench presses for strength. Need more details? Let me know!`;
        case "motivation":
            return prompts.motivation[Math.floor(Math.random() * prompts.motivation.length)];
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
console.log(handleInput("How much protein do I need for muscle gain at 150 lbs?"));
console.log(handleInput("How much water should I drink for 130 lbs, intense activity?"));
console.log(handleInput("Motivate me to work out!"));
