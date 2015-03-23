import from 'bootstrap/less/bootstrap.less';
import from 'bootstrap/docs/assets/css/_src/docs.css';
import from './assets/style.css';

import from './assets/carousel.png';
import from './assets/logo.png';

import React from 'react';
import Root from './src/Root';

// For React devtools
window.React = React;

const blah = 4;
blah = 5;

React.render(<Root {...window.INITIAL_PROPS} />, document);
