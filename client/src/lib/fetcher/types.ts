export type AuthParams = [url: string, userId: string];

export class FetchError extends Error {
	constructor(public res: Response | XMLHttpRequest, message?: string) {
		super(message);
	}

	get status() {
		if (this.res instanceof Response) {
			return this.res.status;
		} else if (this.res instanceof XMLHttpRequest) {
			return this.res.status;
		}
		return undefined;
	}
}

export type FetcherRequestInit = FetchRequestInit & {
	/** If true, returns raw Response. If false, returns JSON Response. */
	stream?: boolean;
	/** If true, removes default "Content-Type" header (Default: false) */
	file?: boolean;
};
