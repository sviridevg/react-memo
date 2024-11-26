const apiUrl = "https://wedev-api.sky.pro/api/v2/leaderboard";

export const getLeaderboard = async () => {
  // Запрос к API получения списка победителей
  const response = await fetch(apiUrl, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Не удалось получить данные с сервера! status: ${response.status}`);
  }

  // console.log(response.json());
  return await response.json();
};
