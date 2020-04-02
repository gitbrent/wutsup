import React, { useState, useEffect } from 'react'

export default function Reddit() {
	//const [status, setStatus] = useState(null)
	const [posts, setPosts] = useState(null)

	useEffect(() => {
		console.log('useEffect')
		test()
	}, [])

	function test() {
		fetch('https://www.reddit.com/r/askreddit.json')
			.then(response => response.json())
			.then(json => {
				console.log(json.data.children)

				let posts: any = []
				json.data.children.forEach((child: any) => {
					posts.push({
						subreddit: child.data.subreddit,
						selftext: child.data.selftext,
						title: child.data.title,
					})
				})

				setPosts(posts)
			})
	}

	/**
	 * /api/v1/me/karma
	 * /api/trending_subreddits
	 */
	function getData() {
		fetch('https://www.reddit.com/r/askreddit.json', {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				//Authorization: 'Bearer ' + params['access_token'],
			},
			mode: 'no-cors',
		})
			.catch(err => {
				throw new Error(err)
			})
			.then(response => {
				console.log(response)
				response.json().then(json => {
					if (json && json.error && json.error.code) {
						// NOTE: Google returns an error object `{error:{errors:[], code:401, message:"..."}}`
						throw json.error
					} else if (json /*&& json.user*/) {
						console.log(json)
					}
				})
			})
			.catch(err => {
				console.error(err.toString())
			})
	}

	return (
		<div>
			<h3>REDDIT</h3>
			<section>
				{(posts || []).map((post: any, idx: number) => (
					<div key={idx}>
						{post.subreddit} = {post.title}
					</div>
				))}
			</section>
		</div>
	)
}
