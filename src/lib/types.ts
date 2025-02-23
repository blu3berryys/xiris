export interface CheckUpdateResponse {
	name: string;
	notes: string;
	pub_date: string;
	url: string;
}
export interface ErrorResponse {
	code: string;
	message: string;
}

export interface Asset {
	name: string;
	api_url: string;
	url: string;
	content_type: string;
	size: number;
}
