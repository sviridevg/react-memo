const apiUrl = "https://wedev-api.sky.pro/api/v2/leaderboard";

export const postLeaderboard = async ({ userName, userTime, achievements }) => {
  // Запрос к API отправки победителя
  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({ name: goodByeHacker(userName), time: userTime, achievements: achievements }),
  });

  if (!response.ok) {
    throw new Error(`Не удалось отправить данные на сервер! status: ${response.status}`);
  }

  return await response.json();
};

function goodByeHacker(text) {
  return text
    .replaceAll("<", "&lt")
    .replaceAll(">", "&gt")
    .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
    .replaceAll("QUOTE_END", "</div>");
}
