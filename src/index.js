import React from 'react'
import ReactDOM from 'react-dom'
//import './css/index.css';
import App from './App'
import * as serviceWorker from './serviceWorker'
import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

const darkTheme = createMuiTheme({
	palette: {
		type: 'dark',
		background: {
			default: '#010101',
		},
		color: '#90caf9',
	},
})

ReactDOM.render(
	<React.StrictMode>
		<MuiThemeProvider theme={darkTheme}>
			<CssBaseline />
			<App />
		</MuiThemeProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
