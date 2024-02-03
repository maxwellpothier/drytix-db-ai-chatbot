import {exit} from "process";
import sql from "./db";
import OpenAI from "openai";
import * as dotenv from "dotenv";
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

async function executeSqlQuery(sqlQuery: string) {
	try {
		const result = await sql.unsafe(sqlQuery);
		return result;
	} catch (error) {
		console.error("Error executing SQL query:", error);
	}
}

(async () => {
	const completion = await openai.chat.completions.create({
		messages: messages,
		model: "gpt-4-1106-preview",
	});

	const sqlQuery = completion.choices[0].message.content?.slice(6, -3);
	console.log("sql query generated.");
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

	console.log(completion2.choices[0].message.content);

	exit();
})();
