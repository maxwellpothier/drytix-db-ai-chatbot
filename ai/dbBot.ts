import {exit} from "process";
import sql from "./db";
import OpenAI from "openai";
import * as dotenv from "dotenv";
import fs from "fs";
import {
	appendUserMessageToBot,
	convertBotToNaturalLanguage,
	messages,
	responseToNaturalLanguagePrompt,
} from "./prompts";
dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const userQuestion = "What is the name of the customer with id 1?";

async function executeSqlQuery(sqlQuery: string) {
	try {
		const result = await sql.unsafe(sqlQuery);
		return result;
	} catch (error) {
		console.error("Error executing SQL query:", error);
	}
}

(async () => {
	appendUserMessageToBot(userQuestion);

	console.log("user question: ", userQuestion);

	const completion = await openai.chat.completions.create({
		messages: messages,
		model: "gpt-4-1106-preview",
	});

	const sqlQuery = completion.choices[0].message.content?.slice(6, -3);
	console.log("sql query generated: ", sqlQuery);
	const result = await executeSqlQuery(sqlQuery.trim());
	console.log("got response from db.");

	convertBotToNaturalLanguage();

	appendUserMessageToBot(
		responseToNaturalLanguagePrompt(sqlQuery, JSON.stringify(result))
	);

	console.log("getting a natural language response...");
	const completion2 = await openai.chat.completions.create({
		messages: messages,
		model: "gpt-4-1106-preview",
	});

	const naturalLanguageResponse = completion2.choices[0].message.content;

	console.log(naturalLanguageResponse);

	const responseJson = {
		question: userQuestion,
		sqlQuery: sqlQuery,
		response: naturalLanguageResponse,
	};

	fs.appendFileSync(
		"ai/results.json",
		JSON.stringify(responseJson, null, 4) + "\n"
	);

	exit();
})();
