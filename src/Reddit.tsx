import React, { useState, useEffect } from 'react'

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

export default function Reddit() {
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
						title: (child.data.title||'').replace(/\&amp\;/gi,'&'),
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
		<div className='card mb-0'>
			<div className='card-header bg-primary text-white text-center'>
				<h3 className='mb-0'>REDDIT</h3>
			</div>
			<div className='card-body'>
				<section className='mb-3' data-desc='filters'>
					<div className='row'>
						<div className='col'>
							<select className='form-control' value={selRedditSub} onChange={event => setSelRedditSub(event.currentTarget.value)}>
								{Object.entries(redditSub).map(([key, val], idx) => (
									<option key={`rsub${idx}`} value={`${key}`}>{`${val}`}</option>
								))}
							</select>
						</div>
						<div className='col-auto'>
							<select className='form-control' value={selSortType} onChange={event => setSelSortType(event.currentTarget.value)}>
								{Object.entries(sortType).map(([key, val], idx) => (
									<option key={`sort${idx}`} value={`${key}`}>{`${val}`}</option>
								))}
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
				</section>

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
							<div key={idx} className='row mb-4'>
								{post.thumbnail && post.thumbnail !== 'default' && post.thumbnail !== 'self' && (
									<div className='col-auto text-center' style={{ minWidth: '130px' }}>
										<img src={post.thumbnail} alt='thumbnail' style={{ maxWidth: '100px', maxHeight: '60px' }} />
									</div>
								)}
								<div className='col'>
									<h5 className='text-white mb-0'>{post.title}</h5>
									<code className='text-white-50'>
										<svg
											className='bi bi-calendar mr-1'
											width='1em'
											height='1em'
											viewBox='0 0 16 16'
											fill='currentColor'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												fill-rule='evenodd'
												d='M14 0H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z'
												clip-rule='evenodd'
											/>
											<path
												fill-rule='evenodd'
												d='M6.5 7a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z'
												clip-rule='evenodd'
											/>
										</svg>
										{post.dateCreated.toDateString()}
									</code>
								</div>
								<div className='col-auto text-center text-primary'>
									<h5>{post.num_comments}</h5>
									<svg className='bi bi-chat h5' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
										<path
											fill-rule='evenodd'
											d='M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 01-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 01.71-.074A8.06 8.06 0 008 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 01-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 00.244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 01-2.347-.306c-.52.263-1.639.742-3.468 1.105z'
											clip-rule='evenodd'
										/>
									</svg>
								</div>
								<div className='col-auto text-center text-warning'>
									<h5>{post.ups}</h5>
									<svg className='bi bi-arrow-up h5' width='1em' height='1em' viewBox='0 0 16 16' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
										<path fill-rule='evenodd' d='M8 3.5a.5.5 0 01.5.5v9a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z' clip-rule='evenodd' />
										<path
											fill-rule='evenodd'
											d='M7.646 2.646a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708L8 3.707 5.354 6.354a.5.5 0 11-.708-.708l3-3z'
											clip-rule='evenodd'
										/>
									</svg>
								</div>
							</div>
						))}
				</section>
			</div>
		</div>
	)
}
