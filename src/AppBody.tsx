import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Paper, Grid, IconButton, Button } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import Reddit from './Reddit'

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
		},
	})
)

export default function AppBody() {
	const classes = useStyles()

	return (
		<>
			<AppBar position='static'>
				<Toolbar>
					<IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
						<MenuIcon />
					</IconButton>
					<Typography variant='h6' className={classes.title}>
						News
					</Typography>
					<Button color='inherit'>Login</Button>
				</Toolbar>
			</AppBar>
			<main>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<section>{Reddit()}</section>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper>TWITTER</Paper>
					</Grid>
				</Grid>
			</main>
		</>
	)
}
