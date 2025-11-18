import { GoogleGenAI } from "@google/genai";
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
    const [jiraId, setJiraId] = useState('');
    const [confluenceUrl, setConfluenceUrl] = useState('');
    const [testPlan, setTestPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Simulates fetching content from a Confluence URL.
     * In a real application, this would involve a backend call
     * to handle CORS and authentication.
     */
    const fetchConfluenceContent = async (url: string): Promise<string> => {
        console.log(`Simulating fetch from: ${url}`);
        // Dummy content to simulate fetched requirements
        return Promise.resolve(`
            User Story:
            As a user, I want to be able to log in to the Volaris application
            using my email and password so that I can access my account.

            Acceptance Criteria:
            1. Given I am on the login page, when I enter valid credentials and tap "Login", then I am successfully logged in and redirected to the dashboard.
            2. Given I am on the login page, when I enter invalid credentials, then an error message "Invalid credentials" is displayed.
            3. Given I am on the login page, the "Login" button should be disabled until both email and password fields are filled.
            4. The email field must be a valid email format.
        `);
    };

    const generateTestPlan = async () => {
        if (!jiraId || !confluenceUrl) {
            setError('Please provide both a Jira Ticket ID and a Confluence URL.');
            return;
        }

        setIsLoading(true);
        setError('');
        setTestPlan('');

        try {
            const confluenceContent = await fetchConfluenceContent(confluenceUrl);
            
            // This is a placeholder for the actual Gemini API call.
            // As per the instructions, a real implementation would use the Gemini API.
            // For this simulation, we generate a static test plan.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const model = 'gemini-2.5-flash'; // Or any other suitable model
            const prompt = `
                Based on the following requirements for Jira ticket ${jiraId},
                generate a comprehensive manual functional test plan for both iOS and Android platforms.
                The plan should be organized by categories (Functional Tests, Negative Tests, UI/UX Tests).
                Omit sections for Automation and Performance testing.

                Requirements from Confluence:
                ---
                ${confluenceContent}
                ---
            `;

            // In a real scenario, you would make the API call like this:
            // const response = await ai.models.generateContent({ model, contents: prompt });
            // const generatedPlan = response.text;
            
            // For this example, we'll use a hardcoded response to simulate the output.
            const simulatedGeminiOutput = `
# Test Plan for Jira Ticket: ${jiraId} - User Login

This document outlines the manual functional test plan for the user login feature on iOS and Android.

---

### **Category: Functional Tests (Happy Path)**

*   **T1 - Successful Login with Valid Credentials**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Launch the Volaris application.
        2.  Navigate to the login screen.
        3.  Enter a registered and valid email address.
        4.  Enter the correct password for that email.
        5.  Tap the "Login" button.
    *   **Expected Result:** The user is successfully authenticated, and the main dashboard screen is displayed.

---

### **Category: Negative Tests**

*   **T2 - Login with Invalid Password**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Navigate to the login screen.
        2.  Enter a registered and valid email address.
        3.  Enter an incorrect password.
        4.  Tap the "Login" button.
    *   **Expected Result:** An error message "Invalid credentials" is displayed. The user remains on the login screen.

*   **T3 - Login with Unregistered Email**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Navigate to the login screen.
        2.  Enter an email address that is not registered.
        3.  Enter any password.
        4.  Tap the "Login" button.
    *   **Expected Result:** An error message "Invalid credentials" is displayed. The user remains on the login screen.

*   **T4 - Login with Invalid Email Format**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Navigate to the login screen.
        2.  Enter an incorrectly formatted email (e.g., "test@domain").
        3.  Enter any password.
        4.  Tap the "Login" button.
    *   **Expected Result:** An inline validation error appears under the email field (e.g., "Please enter a valid email"). The "Login" button might be disabled or the submission fails.

---

### **Category: UI/UX Tests**

*   **T5 - Login Button State**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Navigate to the login screen.
        2.  Observe the "Login" button. It should be disabled/greyed out.
        3.  Enter text in the email field only.
        4.  Observe the "Login" button. It should remain disabled.
        5.  Clear the email field and enter text in the password field only.
        6.  Observe the "Login" button. It should remain disabled.
        7.  Enter text in both email and password fields.
    *   **Expected Result:** The "Login" button becomes enabled/active only when both fields contain text.

*   **T6 - Password Visibility Toggle**
    *   **Platform:** iOS, Android
    *   **Steps:**
        1.  Navigate to the login screen.
        2.  Enter text into the password field. The text should be masked (e.g., with dots or asterisks).
        3.  Find and tap the "show/hide" password icon.
    *   **Expected Result:** The entered password text becomes visible. Tapping the icon again should mask the password.
`;

            setTestPlan(simulatedGeminiOutput.trim());

        } catch (e) {
            console.error(e);
            setError('Failed to generate the test plan. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Volaris Test Plan Agent</h1>
                <p>¡Hola! Soy DORA. Give me a Jira ticket and a Confluence page, and I'll create a test plan for our next adventure!</p>
            </header>
            <main className="main-content">
                <section className="input-section">
                    <h2>🗺️ Provide the Treasure Map Details</h2>
                    <div className="form-group">
                        <label htmlFor="jiraId">Jira Ticket ID (e.g., VPP-5954)</label>
                        <input
                            id="jiraId"
                            type="text"
                            value={jiraId}
                            onChange={(e) => setJiraId(e.target.value)}
                            placeholder="Enter Jira Ticket ID"
                            aria-label="Jira Ticket ID"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confluenceUrl">Confluence Page URL</label>
                        <input
                            id="confluenceUrl"
                            type="url"
                            value={confluenceUrl}
                            onChange={(e) => setConfluenceUrl(e.target.value)}
                            placeholder="https://your.confluence.url/..."
                            aria-label="Confluence Page URL"
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button
                        className="action-button"
                        onClick={generateTestPlan}
                        disabled={isLoading || !jiraId || !confluenceUrl}
                        aria-live="polite"
                    >
                        {isLoading ? 'Exploring...' : '¡Vámonos! (Generate Plan)'}
                    </button>
                </section>
                <section className="output-section">
                    <h2>📜 Your Generated Test Plan</h2>
                    {isLoading ? (
                        <div className="loading-spinner" aria-label="Loading test plan">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <pre className="output-content" aria-live="polite">
                            {testPlan || 'Your test plan will appear here...'}
                        </pre>
                    )}
                </section>
            </main>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);