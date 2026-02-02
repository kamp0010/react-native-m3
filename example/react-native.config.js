const path = require('path')
const pkg = require('../package.json')

/**
 * @type {import('@react-native-community/cli-types').Config}
 */
module.exports = {
    project: {
        ios: {
            automaticPodsInstallation: true,
        },
    },
    dependencies: {
        [pkg.name]: {
            root: path.join(__dirname, '..'),
        },
        'react-native-nitro-modules': {
            root: path.join(__dirname, '..', 'node_modules', 'react-native-nitro-modules'),
        },
    },
}
