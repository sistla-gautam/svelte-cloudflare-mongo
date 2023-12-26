import * as Realm from 'realm-web';
import type { RequestEvent } from '@sveltejs/kit';

type Document = globalThis.Realm.Services.MongoDB.Document;

interface User extends Document {
	playerURL: string;
	email: string;
}

let App: Realm.App;
const ObjectId = Realm.BSON.ObjectID;
let client: any;
let token: any;

export async function GET(event: RequestEvent) {
	App = App || new Realm.App(event.platform?.env.MONGODB_REALM_APPID);
	token = event.platform?.env.MONGODB_API_TOKEN;

	try {
		const credentials = Realm.Credentials.apiKey(token);
		var user = await App.logIn(credentials);
		client = await user.mongoClient('mongodb-atlas');
		const collection = await client.db('random').collection<User>('Users');

		let result = await collection.find();

		if (result) {
			let response = new Response(
				JSON.stringify({
					result
				}),
				{
					status: 200,
					headers: {
						'content-type': 'Application/json'
					}
				}
			);
			return response;
		} else {
			let response = new Response(JSON.stringify('No response'), {
				status: 200,
				headers: {
					'content-type': 'Application/json'
				}
			});
			return response;
		}
	} catch (err) {
		let response = new Response(JSON.stringify(err), {
			status: 500,
			headers: {
				'content-type': 'text/plain; charset=UTF-8'
			}
		});
		return response;
	}
}
