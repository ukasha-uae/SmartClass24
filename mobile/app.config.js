// On EAS the Firebase file arrives as a file secret (GOOGLE_SERVICES_JSON); locally it sits in mobile/.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
});
