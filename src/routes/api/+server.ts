import * as Realm from 'realm-web';

interface Bindings {
	REALM_APPID: string;
}

type document = globalThis.Realm.Services.MongoDB.Document;

interface User extends document {
	id: string;
	name: string;
	banner_picture: string;
	bio: string;
	city: string;
	country: string;
	email: string;
	mode_of_login: string;
	phone: string;
	plan: string;
	profile_picture: string;
	projects: string[];
	state: string;
	streetAddress: string;
	zip: string;
}

let App: Realm.App;
const ObjectId = Realm.BSON.ObjectID;

export async function POST({ request, env }) {
	App = App || new Realm.App(env.REALM_APPID);

	const token = request.headers.get('authorization');
	if (!token) return new Response('Unauthorized', { status: 401 });

	try {
		//create a anaoymous user to access the mongodb
		const user = await App.logIn(Realm.Credentials.anonymous());
		var client = user.mongoClient('mongodb-atlas');
	} catch (err) {
		return new Response('Error with authentication', { status: 401 });
	}
	const collection = client.db('random').collection<User>('users');

	try {
		const result = await collection.find();
		return new Response(JSON.stringify(result));
	} catch (err) {
		return new Response('Error', { status: 401 });
	}
}
