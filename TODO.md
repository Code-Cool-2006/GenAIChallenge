# TODO: Integrate Web Speech API for Text-to-Speech on Home Page

## Information Gathered
- The home page (Home.jsx) contains a hero section with the subtitle: "Master your career with AI-powered resume building, market intelligence, interview prep, and personalized career guidance."
- The user wants to integrate Web Speech API to speak the text: "hello Master your career with AI-powered resume building, market intelligence, interview prep, and personalized career guidance."
- This should be added without hampering existing code, likely as an optional feature triggered by a button.

## Plan
- Modify `src/pages/Home.jsx` to add a "Speak Intro" button in the hero section.
- Implement text-to-speech using the Web Speech API (SpeechSynthesis).
- Add basic error handling for browsers that don't support speech synthesis.
- Ensure the feature is non-blocking and doesn't interfere with existing functionality.

## Dependent Files to Edit
- `src/pages/Home.jsx`: Add button and speech synthesis logic.

## Followup Steps
- Test the speech functionality in different browsers.
- Verify that the button works and speech plays correctly.
- Check for any console errors or performance issues.
