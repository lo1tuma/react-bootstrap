import phantomjsShims from './phantomjs-shims';
phantomjsShims.apply();

const testsContext = require.context('.', true, /Spec$/);
testsContext.keys().forEach(testsContext);
