/**
 * Development Configuration
 * 
 * Set DEV_MODE to false for production builds
 * Change DEV_USER_ROLE to switch between user and CA views
 */

// Master switch for development mode
export const DEV_MODE = true;

// User type for development
// Options: 'user' or 'ca'
export const DEV_USER_ROLE = 'user'; // Change to 'ca' for CA view / 'user' for User view

// Auto-login settings
export const AUTO_LOGIN = true;

// Log dev mode status
if (DEV_MODE) {
  console.log(`🔧 DEV MODE ENABLED - Viewing as: ${DEV_USER_ROLE}`);
  console.log(`📱 App will bypass login and show ${DEV_USER_ROLE} dashboard directly`);
}