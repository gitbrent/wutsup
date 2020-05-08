import React, { useState } from 'react'
import { Box, Grow, Grid } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import Reddit from './views/reddit/RedditNew'
import Weather from './views/Weather'

import { makeStyles } from '@material-ui/core/styles'
const useStylesGrp = makeStyles((theme) => ({
	root: {
		backgroundColor: '#000000',
		color: '#90caf9',
		display: 'flex',
		margin: theme.spacing(0), // just testing 'theme'
		width: '100%',
	},
}))
const useStylesBtn = makeStyles((_theme) => ({
	root: {
		background: 'black',
		border: '1px solid rgba(144, 202, 249, 0.5) !important',
		color: '#90caf9',
		flex: '1',
		//margin: theme.spacing(0), // just testing 'theme'
		padding: '5px 15px',
		'&:hover': {
			border: '1px solid rgba(144, 202, 249, 0.75) !important',
		},
	},
	selected: {
		backgroundColor: 'rgba(144, 202, 249, 0.25) !important',
	},
}))

enum MainView {
	reddit = 'reddit',
	newsWorld = 'world news',
	newsLocal = 'local news',
	twitter = 'twitter',
	weather = 'weather',
}

export default function AppBodyNew() {
	const classesGrp = useStylesGrp()
	const classesBtn = useStylesBtn()

	const [viewSelected, setViewSelected] = useState<MainView | string>(MainView.reddit)

	function renderBoxesWithGrow(): JSX.Element {
		return (
			<Grid container>
				<Grid item xs={12}>
					<Box m={4}>
						<Grow in={true}>
							<Box bgcolor='background.paper' p={5}>
								I JUST FADE IN DEFAULT
								<ArrowUpwardIcon />
							</Box>
						</Grow>

						<Box mb={4} />

						<Grow in={true} style={{ transformOrigin: '0 0 0' }} {...{ timeout: 1000 }}>
							<Box bgcolor='background.paper' p={5}>
								I TAKE 1 SECOND TO FADE IN
								<ArrowUpwardIcon />
							</Box>
						</Grow>
					</Box>
				</Grid>
			</Grid>
		)
	}

	return (
		<>
			<header className='flex-no-shrink'>
				<Box p={0} mb={1}>
					<ToggleButtonGroup
						classes={classesGrp}
						size='small'
						exclusive
						value={viewSelected}
						onChange={(_ev: React.MouseEvent<HTMLElement>, value: string) => setViewSelected(value)}>
						{Object.entries(MainView).map(([key, val], idx) => (
							<ToggleButton key={idx} value={key} classes={classesBtn}>
								{val}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
				</Box>
			</header>
			{viewSelected === MainView.reddit && <Reddit />}
			{viewSelected === MainView.newsWorld && renderBoxesWithGrow()}
			{viewSelected === MainView.twitter && <div>(need a developer key)</div>}
			{viewSelected === MainView.weather && <Weather />}
		</>
	)
}
