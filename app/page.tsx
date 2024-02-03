"use client";
import {answerUserQuestion} from "@/ai/dbBot";
import {useState} from "react";

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [submittedValue, setSubmittedValue] = useState("");

	const handleSubmit = async () => {
		const answer = await answerUserQuestion(inputValue);
		setSubmittedValue(answer);
	};

	return (
		<main className="flex min-h-screen flex-col items-center p-24">
			<input
				type="text"
				value={inputValue}
				onChange={e => setInputValue(e.target.value)}
			/>
			<button onClick={handleSubmit}>Submit</button>
			{submittedValue && <p>You submitted: {submittedValue}</p>}
		</main>
	);
}
