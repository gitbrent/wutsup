import React, { useState, useEffect } from 'react'
//import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { Select, MenuItem, FormControl, InputLabel, Grid, CardContent, Card, CardHeader, Avatar, IconButton, Typography, Box } from '@material-ui/core'

// https://openweathermap.org/current
interface Forecast {
	id: number
	name: string
	timezone: number
	coord: { lon: number; lat: number }
	weather: [{ id: number; main: string; description: string; icon: string }]
	main: { temp: number; feels_like: number; temp_min: number; temp_max: number; pressure: number; humidity: number }
	visibility: number
	wind: { speed: number }
	clouds: { all: number }
	dt: number
	sys: { type: number; id: number; country: string; sunrise: number; sunset: number }
}

export default function Weather() {
	const [cityForecast, setCityForecast] = useState<Forecast>()
	const [cityLocation, setCityLocation] = useState('Dallas,us') // 'London,uk'

	useEffect(() => {
		// FYI: sortType is optional - omit it for default results
		fetch(`http://api.openweathermap.org/data/2.5/weather?units=imperial&q=${cityLocation}&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`)
			.then(response => response.json())
			.then(json => {
				setCityForecast(json as Forecast)
				/*
				let posts: Post[] = []
				json.data.children.forEach((child: Forecast) => {
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
				setPosts(posts)*/
			})
	}, [])

	return (
		<>
			<Grid container>
				<Grid item xs={2}>
					<Box mb={3}>icon</Box>
					<img src={`http://openweathermap.org/img/w/${cityForecast && cityForecast.weather && cityForecast.weather[0].icon}.png`} />
				</Grid>
				<Grid item xs={10}>
					<h2>{cityLocation}</h2>
					<pre>{cityForecast ? JSON.stringify(cityForecast, null, 4) : '?'}</pre>
				</Grid>
			</Grid>
		</>
	)
}
