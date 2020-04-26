import React, { useState, useEffect } from 'react'
import { theme, useStyles, useStylesGridFilter } from './Reddit.styles'
import { DelayTime, RedditSub, SortType, Post, SubJson } from './Reddit.types'
import { Select, MenuItem, FormControl, InputLabel, Grid, CardContent, Card, CardHeader, Avatar, IconButton, Typography, Box } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
//import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'
import MoreVertIcon from '@material-ui/icons/MoreVert'

export default function Reddit() {
	const classesGridFilter = useStylesGridFilter()
	const classes = useStyles()

	const [selDelaySecs, setDelaySecs] = useState<DelayTime | string>(DelayTime.sec30)
	const [selRedditSub, setSelRedditSub] = useState<RedditSub | string>(RedditSub.politics)
	const [selSortType, setSelSortType] = useState<SortType | string>(SortType.top)
	const [posts, setPosts] = useState<Post[]>([])
	const [idxToShow, setIdxToShow] = useState(0)
	//const [isActive, setIsActive] = useState(true)
	//const [seconds, setSeconds] = useState(0)

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
				setSeconds(seconds => seconds + selDelaySecs)
			}, selDelaySecs * 1000)
		} else if (!isActive && seconds !== 0) {
			clearInterval(interval)
		}
		return () => clearInterval(interval)
	}, [isActive, seconds])*/

	/**
	 * Fetch data on init
	 */
	useEffect(() => {
		setIdxToShow(0) // TODO: here to repress compiler warnings until we go back to using delay/refresh
		//fetchSelSub()
		//getApiData()
	}, [])

	useEffect(() => {
		// FYI: sortType is optional - omit it for default results
		fetch(`https://www.reddit.com/r/${selRedditSub}/${selSortType}.json`)
			.then(response => response.json())
			.then(json => {
				let posts: Post[] = []
				json.data.children.forEach((child: SubJson) => {
					posts.push({
						subreddit: child.data.subreddit,
						subreddit_subscribers: child.data.subreddit_subscribers,
						selftext: child.data.selftext,
						title: (child.data.title || '').replace(/&amp;/gi, '&'),
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
	}, [selRedditSub, selSortType])

	/**
	 * /api/v1/me/karma
	 * /api/trending_subreddits
	 */
	/*
	function getApiData() {
		//fetch(`https://www.reddit.com/api/trending_subreddits.json`) // WORKS
		fetch(`https://www.reddit.com/api/trending_subreddits.json`)
		//fetch('https://www.reddit.com/r/askreddit.json', {
		//	method: 'GET',
		//	headers: {
		//		Accept: 'application/json',
		//		//Authorization: 'Bearer ' + params['access_token'],
		//	},
		//	mode: 'no-cors',
		//})
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
	*/

	function renderFilterGrid(): JSX.Element {
		return (
			<Grid container classes={classesGridFilter}>
				<Grid item xs={'auto'} style={{ fontSize: '3rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
					<Box mr={-4} my={'auto'} component='span'>
						<ChevronRightIcon fontSize='inherit' />
					</Box>
					<Box mr={-4} component='span'>
						<ChevronRightIcon fontSize='inherit' />
					</Box>
					<Box component='span'>
						<ChevronRightIcon fontSize='inherit' />
					</Box>
				</Grid>
				<Grid item xs data-desc='filters'>
					<Box>
						<Grid container spacing={2} justify='space-evenly' wrap='nowrap'>
							<Grid item xs>
								<FormControl variant='filled' fullWidth={true}>
									<InputLabel id='filter-subreddit-label'>Subreddit</InputLabel>
									<Select
										labelId='filter-subreddit-label'
										id='filter-subreddit'
										value={selRedditSub}
										onChange={event => setSelRedditSub(event.target.value as string)}>
										{Object.entries(RedditSub).map(([key, val], idx) => (
											<MenuItem key={`sub${idx}`} value={key}>
												{val}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={3}>
								<FormControl variant='filled' fullWidth={true}>
									<InputLabel id='filter-sorttype-label'>Sort By</InputLabel>
									<Select
										labelId='filter-sorttype-label'
										id='filter-sorttype'
										value={selSortType}
										onChange={event => setSelSortType(event.target.value as string)}>
										{Object.keys(SortType).map((key, idx) => (
											<MenuItem key={`typ${idx}`} value={key}>
												{key}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={2}>
								<FormControl variant='filled' fullWidth={true}>
									<InputLabel id='filter-delay-label'>Refresh Delay</InputLabel>
									<Select labelId='filter-delay-label' id='filter-delay' value={selDelaySecs} onChange={event => setDelaySecs(event.target.value as string)}>
										{Object.values(DelayTime).map((val, idx) => (
											<MenuItem key={`del${idx}`} value={val}>
												{val} secs
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Box>
				</Grid>
				<Grid item xs={'auto'} style={{ fontSize: '3rem', paddingLeft: '2rem', paddingRight: '2rem', textAlign: 'right' }}>
					<Box component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
					<Box ml={-4} my={'auto'} component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
					<Box ml={-4} my={'auto'} component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
				</Grid>
			</Grid>
		)
	}

	function renderFullList(): JSX.Element {
		return (
			<Grid container>
				<Grid item xs={12}>
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
							subheader={new Date().toLocaleString()}
						/>
						<CardContent>
							{/*renderFilters()*/}

							<Box mb={0} data-desc='picture posts'>
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
							</Box>

							<Box mb={0} data-desc='regular posts'>
								{posts
									.filter((_post, idx) => idx >= idxToShow)
									.filter(post => !post.url || !(post.url || '').toLowerCase().endsWith('jpg'))
									.map((post, idx) => (
										<Grid key={idx} container spacing={2}>
											<Grid item xs='auto'>
												<Box textAlign='center' style={{ minWidth: '130px' }}>
													{post.thumbnail && post.thumbnail !== 'default' && post.thumbnail !== 'self' ? (
														<img src={post.thumbnail} alt='thumbnail' style={{ maxWidth: '100px', maxHeight: '60px' }} />
													) : (
														<div style={{ width: '100px', height: '60px' }} />
													)}
												</Box>
											</Grid>
											<Grid item xs>
												<Typography itemType='h5' color='textSecondary'>
													{post.title}
												</Typography>
												<Box color={theme.palette.text.disabled} fontFamily='Monospace' fontSize={10}>
													{post.dateCreated.toLocaleString()}
												</Box>
											</Grid>
											<Grid item xs='auto'>
												<Box textAlign='center' fontSize='h6.fontSize' color={indigo.A100} style={{ minWidth: '45px' }}>
													<Typography>{post.num_comments}</Typography>
													<ChatBubbleOutlineOutlinedIcon />
												</Box>
											</Grid>
											<Grid item xs='auto'>
												<Box textAlign='center' fontSize='h6.fontSize' color={theme.palette.error.main} style={{ minWidth: '45px' }}>
													<Typography>{post.ups}</Typography>
													<ArrowUpwardIcon color='error' />
												</Box>
											</Grid>
										</Grid>
									))}
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		)
	}

	function renderLeftCol(): JSX.Element {
		return <div />
	}

	return (
		<>
			{renderFilterGrid()}
			<Grid container>
				<Grid item xs={2}>
					{renderLeftCol()}
				</Grid>
				<Grid item xs={10}>
					{renderFullList()}
				</Grid>
			</Grid>
		</>
	)
}
