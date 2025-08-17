# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up your API Key:**
    - Create a new file named `.env.local` in the main project directory.
    - Open the file and add the following line, replacing `PASTE_YOUR_KEY_HERE` with your actual Gemini API key:
      ```
      GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"
      ```
3.  **Run the app:**
    ```bash
    npm run dev
    ```
