import React, { useState, useEffect } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Button, Icon, Select, MenuItem, FormControl, InputLabel, Grid, Paper, CardContent, Card, CardHeader, Avatar, IconButton, Typography } from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
	palette: {
		type: 'dark',
	},
})

enum redditSub {
	askreddit = 'askreddit',
	memes = 'memes',
	politics = 'politics',
}
enum sortType {
	controversial = 'controversial',
	hot = 'hot',
	new = 'new',
	rising = 'rising',
	top = 'top',
}
interface post {
	subreddit: string // "politics"
	subreddit_subscribers: number
	title: string // "Discussion Thread: White House Coronavirus Task Force Briefing"
	selftext: string // "brief reporters at the White House on the latest developments and the administration’s response"
	permalink: string // "/r/politics/comments/fw07am/rudy_giuliani_attempts_to_position_himself_as/"
	link_flair_text: string // "serious replies only"
	thumbnail: string // "https://a.thumbs.redditmedia.com/nf-fkqLeJ53JAM94pCl7ZzklRzSU8eYoRoE4XYKbkG8.jpg"
	url: string // "https://www.businessinsider.com/rudy-giuliani-makes-coronavirus-pivot-as-trumps-new-science-adviser-2020-4"
	num_comments: number
	ups: number
	downs: number
	over_18: boolean
	score: number
	pinned: boolean
	author: string // "BobJones"
	created: number
	created_utc: number
	dateCreated: Date
	preview?: {
		images: [
			{
				source: { url: string; width: number; height: number }
				resolutions: { url: string; width: number; height: number }[]
			}
		]
	}
}
interface subJson {
	kind: string
	data: post
}

const useStyles = makeStyles((theme: Theme) =>
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
	})
)

export default function Reddit() {
	const classes = useStyles()

	const [delaySecs, setDelaySecs] = useState(30)
	const [selRedditSub, setSelRedditSub] = useState<redditSub | string>(redditSub.politics)
	const [selSortType, setSelSortType] = useState<sortType | string>(sortType.top)
	const [posts, setPosts] = useState<post[]>([])
	const [idxToShow, setIdxToShow] = useState(0)
	const [isActive, setIsActive] = useState(true)
	const [seconds, setSeconds] = useState(0)

	/**
	 * @desc Display loop
	 */
	/*
	useEffect(() => {
		setIdxToShow(idxToShow + 1)

		// Timer below
		let interval: any = null
		if (isActive) {
			interval = setInterval(() => {
				setSeconds(seconds => seconds + delaySecs)
			}, delaySecs * 1000)
		} else if (!isActive && seconds !== 0) {
			clearInterval(interval)
		}
		return () => clearInterval(interval)
	}, [isActive, seconds])*/

	/**
	 * Fetch data on init
	 */
	useEffect(() => {
		fetchSelSub()
		//getApiData()
	}, [])

	useEffect(() => {
		fetchSelSub()
	}, [selRedditSub])

	function fetchSelSub() {
		// FYI: sortType is optional
		fetch(`https://www.reddit.com/r/${selRedditSub}/${selSortType}.json`)
			.then(response => response.json())
			.then(json => {
				let posts: post[] = []
				json.data.children.forEach((child: subJson) => {
					posts.push({
						subreddit: child.data.subreddit,
						subreddit_subscribers: child.data.subreddit_subscribers,
						selftext: child.data.selftext,
						title: (child.data.title || '').replace(/\&amp\;/gi, '&'),
						permalink: child.data.permalink,
						link_flair_text: child.data.link_flair_text,
						thumbnail: child.data.thumbnail,
						url: child.data.url,
						num_comments: child.data.num_comments,
						ups: child.data.ups,
						downs: child.data.downs,
						over_18: child.data.over_18,
						score: child.data.score,
						pinned: child.data.pinned,
						//preview: child.data.preview,
						created: child.data.created,
						created_utc: child.data.created_utc,
						dateCreated: new Date(child.data.created * 1000),
						author: child.data.author,
					})
				})

				setPosts(posts)
			})
	}

	/**
	 * /api/v1/me/karma
	 * /api/trending_subreddits
	 */
	function getApiData() {
		//fetch(`https://www.reddit.com/api/trending_subreddits.json`) // WORKS
		fetch(`https://www.reddit.com/api/trending_subreddits.json`)
			/*
			fetch('https://www.reddit.com/r/askreddit.json', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					//Authorization: 'Bearer ' + params['access_token'],
				},
				mode: 'no-cors',
			})
		*/
			.catch(err => {
				throw new Error(err)
			})
			.then(response => response.json())
			.then(json => {
				if (json && json.error && json.error.code) {
					// NOTE: Google returns an error object `{error:{errors:[], code:401, message:"..."}}`
					throw json.error
				} else if (json) {
					// https://www.reddit.com/api/trending_subreddits.json
					// {subreddit_names: string[]}
					console.log(json)
				}
			})
			.catch(err => {
				console.error(err.toString())
			})
	}

	return (
		<Card>
			<CardHeader
				avatar={
					<Avatar aria-label='recipe' className={classes.avatar}>
						R
					</Avatar>
				}
				action={
					<IconButton aria-label='settings'>
						<MoreVertIcon />
					</IconButton>
				}
				title='REDDIT'
				subheader='September 10, 2021'
			/>
			<CardContent>
				<Grid container spacing={2} justify='space-evenly' wrap='nowrap'>
					<Grid item xs>
						<FormControl variant='filled' fullWidth={true}>
							<InputLabel id='demo-simple-select-label'>Selected Subreddit</InputLabel>
							<Select
								labelId='demo-simple-select-label'
								id='demo-simple-select'
								value={selRedditSub}
								onChange={event => setSelRedditSub(event.target.value as string)}>
								{Object.entries(redditSub).map(([key, val], idx) => (
									<MenuItem key={`menu${idx}`} value={key}>
										{val}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={3}>
						<FormControl variant='filled' fullWidth={true}>
							<InputLabel id='demo-simple-select-filled-label'>Refresh Delay</InputLabel>
							<Select
								labelId='demo-simple-select-filled-label'
								id='demo-simple-select-filled'
								value={delaySecs}
								onChange={event => setDelaySecs(Number(event.target.value))}>
								<MenuItem value={5}>5 sec</MenuItem>
								<MenuItem value={10}>10 sec</MenuItem>
								<MenuItem value={30}>30 sec</MenuItem>
								<MenuItem value={60}>60 sec</MenuItem>
							</Select>
						</FormControl>
					</Grid>
				</Grid>

				<section className='mb-0' data-desc='picture posts'>
					{posts
						.filter((_post, idx) => idx >= idxToShow)
						.filter(post => post.thumbnail && post.url && post.url.toLowerCase().endsWith('jpg'))
						.map((post, idx) => (
							<div key={idx} className='row'>
								<div className='col'>
									<img src={post.url} alt='thumbnail' style={{ maxWidth: '600px', maxHeight: '300px' }} />
								</div>
							</div>
						))}
				</section>

				<section className='mb-0' data-desc='regular posts'>
					{posts
						.filter((_post, idx) => idx >= idxToShow)
						.filter(post => !post.url || !(post.url || '').toLowerCase().endsWith('jpg'))
						.map((post, idx) => (
							<Grid key={idx} container spacing={2}>
								{post.thumbnail && post.thumbnail !== 'default' && post.thumbnail !== 'self' && (
									<Grid item xs='auto' style={{ minWidth: '130px' }}>
										<div className='col-auto text-center' style={{ minWidth: '130px' }}>
											<img src={post.thumbnail} alt='thumbnail' style={{ maxWidth: '100px', maxHeight: '60px' }} />
										</div>
									</Grid>
								)}
								<Grid item xs>
									<Typography itemType='h5' color='textPrimary'>
										{post.title}
									</Typography>
									<Typography itemType='code' color='secondary'>
										{post.dateCreated.toDateString()}
									</Typography>
								</Grid>
								<Grid item xs='auto' color={theme.palette.warning.main}>
									<Typography itemType='h5' color='primary'>
										{post.num_comments}
									</Typography>
									<ChatBubbleOutlineOutlinedIcon color='primary' />
								</Grid>
								<Grid item xs='auto'>
									<Typography itemType='h5' color='error'>
										{post.ups}
									</Typography>
									<ArrowUpwardIcon color='error' />
								</Grid>
							</Grid>
						))}
				</section>
			</CardContent>
		</Card>
	)
}
