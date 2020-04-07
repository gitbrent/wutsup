import React, { useState, useEffect } from 'react'

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

export default function Reddit() {
	const [delaySecs, setDelaySecs] = useState(10)
	const [selReddit, setSelReddit] = useState('politics')
	const [posts, setPosts] = useState<post[]>([])
	const [idxToShow, setIdxToShow] = useState(0)
	const [isActive, setIsActive] = useState(true)
	const [seconds, setSeconds] = useState(0)

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
	}, [isActive, seconds])

	/**
	 * Fetch data on init
	 */
	useEffect(() => {
		fetchSelSub()
		//getApiData()
	}, [])

	useEffect(() => {
		fetchSelSub()
	}, [selReddit])

	function fetchSelSub() {
		fetch(`https://www.reddit.com/r/${selReddit}/rising.json`)
		//fetch(`https://www.reddit.com/r/${selReddit}.json`)
			.then(response => response.json())
			.then(json => {
				let posts: post[] = []
				json.data.children.forEach((child: subJson) => {
					posts.push({
						subreddit: child.data.subreddit,
						subreddit_subscribers: child.data.subreddit_subscribers,
						selftext: child.data.selftext,
						title: child.data.title,
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
						dateCreated: new Date(child.data.created*1000),
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
		<div>
			<h3>REDDIT</h3>
			<h5>AskReddit</h5>
			<div>
				<div className='row'>
					<div className='col'>
						<select className='form-control' value={selReddit} onChange={event => setSelReddit(event.currentTarget.value)}>
							<option value='askreddit'>r/askreddit</option>
							<option value='memes'>r/memes</option>
							<option value='politics'>r/politics</option>
						</select>
					</div>
					<div className='col-auto'>
						<select className='form-control' value={delaySecs} onChange={event => setDelaySecs(Number(event.currentTarget.value))}>
							<option value='5'>5</option>
							<option value='10'>10</option>
							<option value='30'>30</option>
							<option value='60'>60</option>
						</select>
					</div>
				</div>
			</div>
			<section>
				{(posts || [])
					.filter((_post, idx) => idx >= idxToShow)
					.map((post, idx) => (
						<div className='card mb-0' key={idx}>
							<div className='card-header bg-secondary'>
								<div className='row'>
									{post.thumbnail && post.thumbnail !== 'default' && post.thumbnail !== 'self' && (
										<div className='col-auto'>
											<img src={post.thumbnail} style={{ maxWidth: '100px', maxHeight: '60px' }} />
										</div>
									)}
									<div className='col'>
										<h6 className='text-white mb-0'>{post.title}</h6>
										<div>{post.dateCreated.toDateString()}</div>
									</div>
									<div className='col-auto'>
										<h6 className='text-white mb-0'>{post.num_comments}</h6>
									</div>
									<div className='col-auto'>
										<h6 className='text-white mb-0'>{post.ups}</h6>
									</div>
								</div>
							</div>
							{post.thumbnail && post.url && post.url.toLowerCase().endsWith('jpg') && (
								<div className='card-body'>
									<img src={post.url} style={{ maxWidth: '600px', maxHeight: '300px' }} />
								</div>
							)}
							{/*
							<div className='card-footer'>{post.author}</div>
						*/}
						</div>
					))}
			</section>
		</div>
	)
}
