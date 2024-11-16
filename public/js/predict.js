document.getElementById("predictButton").addEventListener("click", async function() {
    // Select the form and gather data
    const form = document.getElementById("mealForm");
    const formData = new FormData(form); // Create FormData object with form data

    // Validate that necessary form fields are not empty
    const mealType = formData.get("MealType");
    const time = formData.get("Time");
    const date = formData.get("Date");
    const gram = formData.get("Gram");
    const glucoseLevel = formData.get("GlucoseLevelAfterTwoHours");

    // Check if any of the required fields are null or empty
    if (!mealType || !time || !date || !gram || !glucoseLevel) {
        alert("Please fill in all required fields before predicting.");
        return; // Exit the function if validation fails
    }

    try {
        // Send a POST request to the /predict-glucose route with form data
        const response = await fetch("/predict-glucose", {
            method: "POST",
            body: formData
        });

        // Check if the response is OK, then parse JSON
        if (response.ok) {
            const data = await response.json();
            // Display the predicted glucose level
               alert("Your Predicted Glucose Level: " + data.predictedLevel + " which is " + 
(data.predictedLevel > 110 ? "higher than the regular range." : "within the regular range."));
        } else {
            console.error("Failed to predict glucose level:", response.statusText);
        }
    } catch (error) {
        console.error("Error predicting glucose level:", error);
    }
});
