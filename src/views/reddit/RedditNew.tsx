import React, { useState, useEffect } from 'react'
import Moment from 'moment'
import { theme, useStyles, useStylesGridFilter } from './Reddit.styles'
import { Comment, DelayTime, RedditSub, SortType, Post, SubJson } from './Reddit.types'
import { Box, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core'
import indigo from '@material-ui/core/colors/indigo'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ChatBubbleOutlineOutlinedIcon from '@material-ui/icons/ChatBubbleOutlineOutlined'
import LinkIcon from '@material-ui/icons/Link'
import PersonIcon from '@material-ui/icons/Person'
import Progress from './Progress'

export default function Reddit() {
	const classesGridFilter = useStylesGridFilter()
	const classes = useStyles()

	const [selDelaySecs, setSelDelaySecs] = useState<DelayTime | string>(DelayTime.sec30)
	const [selRedditSub, setSelRedditSub] = useState<RedditSub | string>(RedditSub.politics)
	const [selSortType, setSelSortType] = useState<SortType | string>(SortType.top)
	const [posts, setPosts] = useState<Post[]>([])
	const [comments, setComments] = useState<Comment[]>([])

	useEffect(() => {
		// FYI: sortType is optional - omit it for default results
		fetch(`https://www.reddit.com/r/${selRedditSub}/${selSortType}.json`)
			.then((response) => response.json())
			.then((json) => {
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
						id: child.data.id,
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

	useEffect(() => {
		if (posts && posts.length > 0 && posts[0] && posts[0].id)
			fetch(`https://www.reddit.com/r/${selRedditSub}/comments/${posts[0].id}.json`)
				//fetch(`https://www.reddit.com/r/politics/comments/g7thtw.json`)
				.then((response) => response.json())
				.then((json) => {
					let comments: Comment[] = []
					json[1].data.children.forEach((child: any) => {
						child.data.created = new Date(child.data.created * 1000)
						comments.push(child.data)
					})
					setComments(comments)
				})
	}, [posts, selRedditSub])

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

	function showNextPost() {
		setPosts([...posts.splice(1)])
	}

	function renderFilterGrid(): JSX.Element {
		return (
			<Grid container classes={classesGridFilter}>
				<Grid item xs={'auto'} style={{ fontSize: '4rem', paddingLeft: '0rem', paddingRight: '2rem' }}>
					<Box mr={-6} my={'auto'} component='span'>
						<ChevronRightIcon fontSize='inherit' />
					</Box>
					<Box mr={-6} component='span'>
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
										onChange={(event) => setSelRedditSub(event.target.value as string)}>
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
										onChange={(event) => setSelSortType(event.target.value as string)}>
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
									<Select
										labelId='filter-delay-label'
										id='filter-delay'
										value={selDelaySecs}
										onChange={(event) => setSelDelaySecs(event.target.value as string)}>
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
					<Box mt={2}>
						<Progress delaySecs={selDelaySecs ? Number(selDelaySecs) : 0} callbackTimerDone={showNextPost} />
					</Box>
				</Grid>
				<Grid item xs={'auto'} style={{ fontSize: '4rem', paddingLeft: '2rem', paddingRight: '0rem', textAlign: 'right' }}>
					<Box component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
					<Box ml={-6} my={'auto'} component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
					<Box ml={-6} my={'auto'} component='span'>
						<ChevronLeftIcon fontSize='inherit' />
					</Box>
				</Grid>
			</Grid>
		)
	}

	function renderLeftCol(): JSX.Element {
		return (
			<Box p={1}>
				{posts
					.filter((post) => !post.url || !(post.url || '').toLowerCase().endsWith('jpg'))
					.map((post, idx) => (
						<Box key={`title${idx}`} mb={1}>
							<Card className={classes.root} variant='outlined'>
								<CardContent style={{ paddingBottom: '12px' }}>
									<Typography color='textSecondary' gutterBottom>
										{post.title}
									</Typography>
									<Grid container spacing={1} alignItems='center'>
										<Grid item xs='auto'>
											<ArrowUpwardIcon color='error' />
										</Grid>
										<Grid item xs>
											<Typography color='error'>{post.ups}</Typography>
										</Grid>
										<Grid item xs='auto'>
											<ChatBubbleOutlineOutlinedIcon />
										</Grid>
										<Grid item xs>
											{post.num_comments}
										</Grid>
										<Grid item xs='auto' style={{ color: '#696969' }}>
											<AccessTimeIcon />
										</Grid>
										<Grid item xs='auto' style={{ color: '#696969' }}>
											{Moment(post.dateCreated).fromNow()}
										</Grid>
									</Grid>
								</CardContent>
							</Card>
						</Box>
					))}
			</Box>
		)
	}

	function renderReply(item: Comment): JSX.Element {
		return (
			<>
				<Grid container spacing={1} alignItems='center'>
					<Grid item xs='auto'>
						<Box color={theme.palette.error.main}>
							<Grid container spacing={1}>
								<Grid item xs='auto'>
									<ArrowUpwardIcon />
								</Grid>
								<Grid item xs>
									<Typography>{item.ups}</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs='auto'>
						<Box color={theme.palette.text.secondary}>
							<Grid container spacing={1}>
								<Grid item xs='auto'>
									<Box color={theme.palette.text.secondary}>
										<PersonIcon />
									</Box>
								</Grid>
								<Grid item xs>
									<Typography>
										{item.author} {item.author_flair_text}
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs>
						<Box color={theme.palette.text.disabled}>
							<Grid container spacing={1}>
								<Grid item xs='auto'>
									<AccessTimeIcon />
								</Grid>
								<Grid item xs='auto'>
									<Typography>{Moment(item.created).fromNow()}</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs>
						{/* FIXME:decode first	<div dangerouslySetInnerHTML={{ __html: item.body_html }}></div>*/}
						{item.body}
					</Grid>
				</Grid>
			</>
		)
	}

	function renderCurrPost(): JSX.Element {
		return (
			<Box px={4} py={3}>
				{posts
					.filter((_post, idx) => idx <= 0) // TODO: showing only first during dev/WIP
					.filter((post) => !post.url || !(post.url || '').toLowerCase().endsWith('jpg'))
					.map((post, idx) => (
						<div key={idx}>
							<Grid container data-desc='title'>
								<Grid item xs>
									<Typography variant='h3' color='textSecondary'>
										{post.title}
									</Typography>
								</Grid>
							</Grid>

							<Box mt={3} mb={1} data-desc='thumbnail and link'>
								<Grid container spacing={2}>
									<Grid item xs='auto'>
										{post.thumbnail && post.thumbnail !== 'default' && post.thumbnail !== 'self' ? (
											<img src={post.thumbnail} alt='thumbnail' style={{ maxWidth: '100px', maxHeight: '60px' }} />
										) : (
											<div style={{ width: '100px', height: '60px' }} />
										)}
									</Grid>
									<Grid item xs>
										{post.url}
									</Grid>
								</Grid>
							</Box>

							<Box color={theme.palette.text.disabled} mb={3} data-desc='subreddit and author'>
								<Grid container spacing={5} alignItems='center'>
									<Grid item xs='auto'>
										<Box color={theme.palette.error.main}>
											<Grid container spacing={1}>
												<Grid item xs='auto'>
													<ArrowUpwardIcon color='error' />
												</Grid>
												<Grid item xs='auto'>
													<Typography>{post.ups}</Typography>
												</Grid>
											</Grid>
										</Box>
									</Grid>
									<Grid item xs='auto'>
										<Box color={indigo.A100}>
											<Grid container spacing={1}>
												<Grid item xs='auto'>
													<ChatBubbleOutlineOutlinedIcon />
												</Grid>
												<Grid item xs='auto'>
													<Typography>{post.num_comments}</Typography>
												</Grid>
											</Grid>
										</Box>
									</Grid>
									<Grid item xs='auto'>
										<Grid container spacing={1}>
											<Grid item xs='auto'>
												<LinkIcon />
											</Grid>
											<Grid item xs='auto'>
												<a href={post.permalink} target='_blank' rel='noopener noreferrer' style={{ color: 'white' }}>
													{post.subreddit}
												</a>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs='auto'>
										<Grid container spacing={1}>
											<Grid item xs='auto'>
												<PersonIcon />
											</Grid>
											<Grid item xs='auto'>
												{post.author}
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs='auto'>
										<Grid container spacing={1}>
											<Grid item xs='auto'>
												<AccessTimeIcon />
											</Grid>
											<Grid item xs='auto'>
												{post.dateCreated.toLocaleString()} ({Moment(post.dateCreated).fromNow()})
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Box>

							<Box>
								{comments
									.filter((item) => item.author !== 'AutoModerator')
									.map((item, idx) => (
										<Box key={`comm${idx}`} mb={2}>
											<Card className={classes.root} variant='outlined'>
												<CardContent>
													<Box className={classes.borderB} pb={1} mb={2}>
														{renderReply(item)}
													</Box>
													{item.replies &&
														item.replies.data &&
														item.replies.data.children &&
														item.replies.data.children.map((child, idy) => (
															<Box key={`box${idy}`} className={idy%2 === 0 ? classes.borderL0 : classes.borderL1} pl={2} mb={1}>
																{renderReply(child.data)}
															</Box>
														))}
												</CardContent>
											</Card>
										</Box>
									))}
							</Box>
						</div>
					))}
			</Box>
		)
	}

	return (
		<>
			<div className='flex-no-shrink'>{renderFilterGrid()}</div>
			{!posts || posts.length === 0 ? (
				<Grid container className='flex-section'>
					<Box my={5} textAlign='center'>
						<CircularProgress size='8rem' />
					</Box>
				</Grid>
			) : (
				<Grid container className='flex-section' style={{ backgroundImage: 'linear-gradient(to right, #1e3a64, #0a1a38, #010101)' }}>
					<Grid item xs={3} className={'flex-col-scroll'}>
						{renderLeftCol()}
					</Grid>
					<Grid item xs={9} className={'flex-col-scroll'}>
						{renderCurrPost()}
					</Grid>
				</Grid>
			)}
		</>
	)
}
