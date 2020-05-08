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
	secNo = 'None',
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
	over_18: boolean
	num_comments: number
	ups: number
	downs: number
	score: number
	//all_awardings: [{giver_coin_reward,icon_url}]
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

export interface Comment {
	all_awardings: []
	approved_at_utc: string
	approved_by: string
	archived: boolean
	associated_award: string
	author: string
	/*
	author_flair_background_color: string
	author_flair_css_class: string
	author_flair_richtext: []
	author_flair_template_id: "7be44c6e-be39-11e6-b398-0eae18c336b8"
	author_flair_text: ":flag-us: America"
	author_flair_text_color: "dark"
	author_flair_type: "richtext"
	author_fullname: "t2_50zb18iw"
	author_patreon_flair: boolean
	author_premium: boolean
	*/
	awarders: []
	banned_at_utc: string
	banned_by: string
	body: string
	body_html: string
	can_gild: boolean
	can_mod_post: boolean
	collapsed: boolean
	collapsed_because_crowd_control: string
	collapsed_reason: string
	controversiality: number
	created: number
	created_utc: number
	depth: number
	distinguished: string
	downs: number
	edited: boolean
	gilded: number
	gildings: {}
	id: string
	is_submitter: boolean
	likes: string
	link_id: string
	locked: boolean
	mod_note: string
	mod_reason_by: string
	mod_reason_title: string
	mod_reports: []
	name: string
	no_follow: boolean
	num_reports: string
	parent_id: string
	permalink: string
	removal_reason: string
	//replies: {kind: "Listing", data: {…}}
	report_reasons: string
	saved: boolean
	score: number
	score_hidden: boolean
	send_replies: boolean
	stickied: boolean
	subreddit: string
	subreddit_id: string
	subreddit_name_prefixed: string
	subreddit_type: string
	total_awards_received: number
	treatment_tags: []
	ups: number
	user_reports: []
}
