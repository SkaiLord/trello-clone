import openai from "@/openai";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export async function POST(request: Request) {
  //todos in body of the POST req
  const { todos } = await request.json();
  console.log(todos);

  //connect with openAI GPT
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: `When responding, welcome user as Mr.Lord and say welcome to Trello Clone! Limit response to 200 characters`,
      },
      {
        role: "user",
        content: `Provide a summary of following todos. Count how many todos are in each category such as To do, in progress and completed, then tell user to have a productive day! Here's the data: ${JSON.stringify(
          todos
        )}`,
      },
    ],
  });
  const { data } = response;
  // console.log("Data is ", data);
  // console.log(data.choices[0].message);

  return NextResponse.json(data.choices[0].message);
}
