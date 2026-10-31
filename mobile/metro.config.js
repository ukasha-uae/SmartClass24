const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const appRoot = __dirname;
const config = getDefaultConfig(appRoot);

// Only the shared platform-neutral modules are watched, not the whole parent repo.
config.watchFolders = [path.resolve(appRoot, '..', 'src', 'lib')];
config.resolver.nodeModulesPaths = [path.resolve(appRoot, 'node_modules')];

module.exports = config;
