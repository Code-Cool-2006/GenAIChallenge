# TODO: Enhance UI/UX and Remove Login/Signup Errors

## Information Gathered
- LoginPage.jsx contains login/signup forms with error handling, but errors may occur due to API calls or mock implementations.
- GoogleAuth component is a placeholder showing a message instead of real authentication.
- Backend auth endpoints (/api/auth/register and /api/auth/login) are implemented and server is running.
- Home page already has text-to-speech functionality.
- Navbar and styles are responsive and modern, but could use minor enhancements.
- App.jsx routes to login first, then protected routes with navbar.

## Plan
- Enhance LoginPage.jsx: Improve design with better colors, animations, and error handling. Replace mock GoogleAuth with a better placeholder or remove it. Add better loading states and user feedback.
- Update Navbar.jsx: Add a logout button if user is logged in (check localStorage for token).
- Minor UI enhancements to Home.jsx: Add subtle animations or improve button styles.
- Ensure no code is hampered: All changes are additive and non-breaking.

## Dependent Files to Edit
- `src/pages/LoginPage.jsx`: Enhance UI, improve error messages, update GoogleAuth.
- `src/components/Navbar/Navbar.jsx`: Add logout functionality.
- `src/pages/Home.jsx`: Minor UI tweaks.

## Followup Steps
- Test login/signup functionality to ensure errors are resolved.
- Verify UI enhancements work on different screen sizes.
- Check for any console errors or performance issues.

## Completed Tasks
- [x] Updated GoogleAuth message to be more informative.
- [x] Added logout button to Navbar when user is logged in.
- [x] Added logout functionality with token removal and navigation.
- [x] Updated Navbar CSS for logout button styling.
- [x] Changed "Watch Demo" button to "🎤 Listen Intro" for text-to-speech.
