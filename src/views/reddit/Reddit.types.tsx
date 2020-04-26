export enum RedditSub {
	askreddit = 'askreddit',
	memes = 'memes',
	politics = 'politics',
}

export enum SortType {
	controversial = 'controversial',
	hot = 'hot',
	new = 'new',
	rising = 'rising',
	top = 'top',
}

export enum DelayTime {
	sec05 = '5',
	sec10 = '10',
	sec15 = '15',
	sec30 = '30',
	sec60 = '60',
}

// --------------------------------------------------------

export interface Post {
	subreddit: string // "politics"
	subreddit_subscribers: number
	title: string // "Discussion Thread: White House Coronavirus Task Force Briefing"
	selftext: string // "brief reporters at the White House on the latest developments and the administration’s response"
	permalink: string // "/r/politics/comments/fw07am/rudy_giuliani_attempts_to_position_himself_as/"
	link_flair_text: string // "serious replies only"
	thumbnail: string // "https://a.thumbs.redditmedia.com/nf-fkqLeJ53JAM94pCl7ZzklRzSU8eYoRoE4XYKbkG8.jpg"
	url: string // "https://www.businessinsider.com/rudy-giuliani-makes-coronavirus-pivot-as-trumps-new-science-adviser-2020-4"
	id: string // ID36 article ID // "g7thtw"
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

export interface SubJson {
	kind: string
	data: Post
}
