module.exports = {
    name: 'devices-adapter-hikvision',
    preset: '../../../jest.config.js',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
    coverageDirectory: '../../../coverage/libs/devices-adapter/hikvision'
};
