import React, { useState, useEffect } from 'react'
//import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Box, Grow, Paper } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
//import indigo from '@material-ui/core/colors/indigo'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'

export default function Testbed() {
	const [checked, setChecked] = React.useState(false)

	return (
		<Box m={4}>
			<Box mb={4}>
				<ToggleButtonGroup
					size='small'
					exclusive
					value={checked ? 'show' : 'hide'}
					onChange={(_ev: React.MouseEvent<HTMLElement>, value: string) => setChecked(value === 'show' ? true : false)}>
					<ToggleButton key={1} value='show'>
						SHOW
					</ToggleButton>
					<ToggleButton key={2} value='hide'>
						HIDE
					</ToggleButton>
				</ToggleButtonGroup>
			</Box>

			<Grow in={checked}>
				<Box bgcolor='background.paper' p={5}>
					I JUST FADE IN DEFAULT
					<ArrowUpwardIcon />
				</Box>
			</Grow>

			<Box mb={4} />

			<Grow in={checked} style={{ transformOrigin: '0 0 0' }} {...(checked ? { timeout: 1000 } : {})}>
				<Box bgcolor='background.paper' p={5}>
					I TAKE 1 SECOND TO FADE IN
					<ArrowUpwardIcon />
				</Box>
			</Grow>
		</Box>
	)
}
