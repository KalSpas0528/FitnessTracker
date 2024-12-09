# FitnessTracker
# Welcome to PowerTitan! 
# This is an interactive app in which you are instructed to log in/sign up to your account, and then you are able to navigate to the add-workouts page on the sidebar, where you can input your workoutd data information like excersise, sets,reps, and weight!
# All your inputted data will be remembered on your account, allowing for quick reference next time you log in!
# You can also input nutritional values, and your own complimentery AI Chatbot!
# I am using render, supabase, express, and node,for backend, with github files to code!
# app.js is backend code on github
# .env are some defined variables on the backend
# index.html is frontend html
# style.css is frontend cscs
# script.js is frontend javacript code


# HTML CODE
# # # <!DOCTYPE html>
# <html lang="en">
 <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PowerTitan Fitness Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <!-- Load dependencies first -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body class="bg-gray-100">
    <!-- Your existing HTML content remains the same -->

    <!-- Change script loading to regular scripts instead of modules -->
    <script type="module" src="./supabase-config.js"></script>
    <script type="module" src="./ai-logic.js"></script>
    <script type="module" src="./script.js"></script>
    
        <!-- Add this script to ensure functions are globally available -->
    <script>
        // Make sure functions are available in the global scope
        window.addEventListener('load', function() {
            // Initialize the application
            init();
            
            // Make functions globally available
            window.showDashboard = showDashboard;
            window.showAddWorkout = showAddWorkout;
            window.showLoginForm = showLoginForm;
            window.showSignupForm = showSignupForm;
            window.showNutrition = showNutrition;
            window.showMotivation = showMotivation;
            window.showChatWithTitanAI = showChatWithTitanAI;
            window.logout = logout;
            window.deleteWorkout = deleteWorkout;
        });
    </script>
</body>
</html>