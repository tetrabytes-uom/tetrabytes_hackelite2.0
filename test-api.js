// Test script for study plan API endpoints
// Using built-in fetch (Node.js 18+)

async function testStudyPlanUpdate() {
  console.log("🧪 Testing Study Plan Update API...");

  // First, let's try to get existing study plans
  try {
    console.log("\n📋 Getting existing study plans...");
    const getResponse = await fetch("http://localhost:3001/api/study-plans", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Note: This would normally include authentication headers
        // For testing purposes, we'll see what happens without auth
      },
    });

    console.log("GET Response Status:", getResponse.status);
    const getData = await getResponse.text();
    console.log("GET Response:", getData);
  } catch (error) {
    console.error("❌ Error fetching study plans:", error);
  }

  // Now let's try to create a test study plan
  try {
    console.log("\n📝 Creating test study plan...");
    const testPlan = {
      subject: "Test Subject",
      modules: [
        { name: "Test Module 1", timeAllocation: 2 },
        { name: "Test Module 2", timeAllocation: 3 },
      ],
      totalTime: 5,
    };

    const postResponse = await fetch("http://localhost:3001/api/study-plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testPlan),
    });

    console.log("POST Response Status:", postResponse.status);
    const postData = await postResponse.text();
    console.log("POST Response:", postData);

    // If creation was successful, try to update it
    if (postResponse.ok) {
      const createdPlan = JSON.parse(postData);
      const planId = createdPlan.studyPlan.id;

      console.log("\n🔄 Testing update of study plan:", planId);

      const updateData = {
        subject: "Updated Test Subject",
        modules: [
          { name: "Updated Module 1", timeAllocation: 2.5 },
          { name: "Updated Module 2", timeAllocation: 3.5 },
          { name: "New Module", timeAllocation: 1 },
        ],
        totalTime: 7,
      };

      const putResponse = await fetch(
        `http://localhost:3001/api/study-plans/${planId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("PUT Response Status:", putResponse.status);
      const putResponseData = await putResponse.text();
      console.log("PUT Response:", putResponseData);
    }
  } catch (error) {
    console.error("❌ Error testing study plan operations:", error);
  }
}

// Run the test
testStudyPlanUpdate();
