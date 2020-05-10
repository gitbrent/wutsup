import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
})

export const useStylesGridFilter = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			background: '#000000',
			border: '1px solid rgba(144, 202, 249, 0.5)',
			borderRadius: 4,
			color: theme.palette.text.primary,
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1),
			padding: theme.spacing(3),
		},
		container: {
			//background: '#FF0000 !important', // WORKS
		},
		item: {
			margin: 'auto',
		},
	})
)

export const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		paper: {
			padding: theme.spacing(2),
			textAlign: 'center',
			color: theme.palette.text.secondary,
		},
		expandOpen: {
			transform: 'rotate(180deg)',
		},
		avatar: {
			backgroundColor: '#fc0000',
		},
		borderB: {
			borderBottom: '1px solid rgba(255,255,255,0.25)',
		},
		borderL: {
			borderLeft: '1px solid rgba(255,0,0,0.75)',
		},
		borderL0: {
			borderLeft: '2px solid darkgreen',
		},
		borderL1: {
			borderLeft: '2px solid darkviolet',
		},
		borderL2: {
			borderLeft: '2px solid darkgoldenrod',
		},
		borderL3: {
			borderLeft: '2px solid amber',
		},
		borderL4: {
			borderLeft: '2px solid teal',
		},
	})
)
