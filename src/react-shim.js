import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// Make React available globally for lucide-react icons
window.G = React;
window.React = React;
window.ReactDOM = ReactDOM;

// Also export for module usage
export { React, ReactDOM };
export default React;