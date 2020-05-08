import React, { useState, useEffect } from 'react'
//import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
//import { Select, MenuItem, FormControl, InputLabel, Grid, CardContent, Card, CardHeader, Avatar, IconButton, Typography, Box, ButtonGroup, Button } from '@material-ui/core'
import { Grid, Box, ButtonGroup, Button } from '@material-ui/core'

enum ForecastCity {
	'Dallas, TX' = 'Dallas,us',
	'Honolulu, HI' = 'Honolulu,us',
	'London, UK' = 'London,uk',
	'Tokyo, JP' = 'Tokyo,jp',
}

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

// 7-day forecast
// https://openweathermap.org/api/one-call-api#parameter
// https://api.openweathermap.org/data/2.5/onecall?lat=60.99&lon=30.9&appid={YOUR API KEY}

export default function Weather() {
	const [cityForecast, setCityForecast] = useState<Forecast>()
	const [cityLocation, setCityLocation] = useState<ForecastCity | string>(ForecastCity['Dallas, TX'])

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
	}, [cityLocation])

	function renderLeftCityPicker() {
		return (
			<ButtonGroup orientation='vertical' style={{ width: '100%' }}>
				{Object.entries(ForecastCity).map(([key, val], idx) => (
					<Button key={`city${key}`} onClick={() => setCityLocation(val)}>
						{key}
					</Button>
				))}
			</ButtonGroup>
		)
	}

	return (
		<>
			<Grid container>
				<Grid item xs={2}>
					{renderLeftCityPicker()}
				</Grid>
				<Grid item xs={10} style={{ padding: '1rem' }}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Box borderBottom='1px solid #fff'>
								<h2 style={{ margin: '0px' }}>{cityForecast && cityForecast.name ? cityForecast.name : '?'}</h2>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box borderBottom='1px solid #fff'>
								<h2 style={{ margin: '0px' }}>
									{cityForecast && cityForecast.main && cityForecast.main.temp ? Math.round(cityForecast.main.temp) : '?'}
									<sup style={{ fontSize: '.8rem' }}>o</sup>F
								</h2>
							</Box>
						</Grid>
					</Grid>

					<Box my={4} bgcolor='background.secondary'>
						<div>openweather api json</div>
						<pre>{cityForecast ? JSON.stringify(cityForecast, null, 4) : '?'}</pre>
					</Box>
					<Box mb={3}>icon</Box>
					<img src={`http://openweathermap.org/img/w/${cityForecast && cityForecast.weather && cityForecast.weather[0].icon}.png`} alt='icon' />
				</Grid>
			</Grid>
		</>
	)
}
