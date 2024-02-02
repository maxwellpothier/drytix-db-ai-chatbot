import endent from "endent";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions.mjs";

const databaseSchema = endent`
	create table Cleaner (
		id bigint primary key generated always as identity,
		business_name text,
		contact_name text,
		contact_email text,
		password text,
		phone_number text
	);

	create table Customer (
		id bigint primary key generated always as identity,
		name text,
		email text,
		password text,
		phone_number text
	);

	create table Job (
		id bigint primary key generated always as identity,
		cleaner_id bigint references Cleaner(id),
		customer_id bigint references Customer(id)
	);
`;

export const messages: ChatCompletionMessageParam[] = [
	{
		role: "system",
		content:
			"You are an expert at querying a sql database. A user will give you a natural language input in the form of a question, and you will respond with a SQL query that answers the question. You can assume that you have access to the database.",
	},
	{
		role: "system",
		content: `The database schema is as follows: ${databaseSchema}`,
	},
	{role: "user", content: "How are the customer and cleaner related?"},
];
