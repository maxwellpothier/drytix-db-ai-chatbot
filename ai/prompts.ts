import endent from "endent";
import {ChatCompletionMessageParam} from "openai/resources/chat/completions.mjs";

const backgroundPrompt = endent`
	You are an expert at querying a sql database.
	A user will give you a natural language input in the form of a question, 
	and you will respond with a SQL query that answers the question. 
	You can assume that you have access to the database.
	Respond strictly with SQL queries, and do not include any other information in your response.
	Even if there appears to be a problem, respond strictly with a SQL query.
`;

const databaseSchema = endent`
	create table Cleaner (
		id bigint primary key generated always as identity,
		business_name text,
		contact_name text,
		contact_email text not null,
		password text not null,
		phone_number text not null
	);
	
	create table Customer (
		id bigint primary key generated always as identity,
		name text,
		email text not null,
		password text not null,
		phone_number text not null
	);
	
	create table Item (
		id bigint primary key generated always as identity,
		name text check (name in ('Shirt', 'Pants', 'Dress', 'Suit')) not null,
		status text check (status in ('Not started', 'In progress', 'Finished')) not null
	);
	
	create table Job (
		id bigint primary key generated always as identity,
		cleaner_id bigint references Cleaner(id) not null,
		customer_id bigint references Customer(id) not null,
		item_id bigint references Item(id) not null,
		start_time timestamptz default current_timestamp,
		is_finished boolean default false,
		cost numeric(10, 2) not null
	);
`;

const convertBotToNaturalLanguagePrompt = endent`
	After helping the user with their sql query, they will need help understanding the response. 
	Please provide a natural language response to the user's question. 
	Do not respond with sql anymore.
`;

export const responseToNaturalLanguagePrompt = (
	query: string,
	response: string
) => {
	return endent`
		The SQL query ${query} gave back the following information: ${response}
		The user is not able to descipher what this information means. Based on the sql query and the database schema,
		give the user a natural language response to their question.
	`;
};

export const convertBotToNaturalLanguage = () => {
	messages.push({
		role: "system",
		content: convertBotToNaturalLanguagePrompt,
	});
};

export const appendUserMessageToBot = (message: string) => {
	messages.push({
		role: "user",
		content: message,
	});
};

export const messages: ChatCompletionMessageParam[] = [
	{
		role: "system",
		content: backgroundPrompt,
	},
	{
		role: "system",
		content: `The database schema is as follows: ${databaseSchema}`,
	},
];
