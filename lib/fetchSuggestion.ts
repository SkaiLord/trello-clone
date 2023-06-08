import formatTodosAI from "./formatTodosAI";

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosAI(board);
  //   console.log("Formated todos:", todos);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todos }),
  });

  const GPTData = await res.json();
  const { content } = GPTData;

  return content;
};

export default fetchSuggestion;
