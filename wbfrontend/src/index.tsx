import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');

if (root) {
	const rootContainer = createRoot(root);
	rootContainer.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
} else {
	console.error("Root element with id 'root' not found in the document.");
}

reportWebVitals(console.log);