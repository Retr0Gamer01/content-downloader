// Перевод сообщений
const messages = {
    keywordNotFound: "Ключевое слово не найдено.",
    loadingError: "Ошибка загрузки контента.",
    downloadComplete: "Загрузка завершена!",
  };
  
  // Обновите функции для отображения сообщений
  async function getUrls() {
    const keyword = document.getElementById('keyword').value.trim();
    if (!keyword) {
      alert("Введите ключевое слово!");
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyword }),
      });
  
      if (response.ok) {
        const urls = await response.json();
        const urlList = document.getElementById('url-list');
        urlList.innerHTML = '';
        urls.forEach(url => {
          const li = document.createElement('li');
          li.textContent = url;
          li.onclick = () => downloadContent(url);
          urlList.appendChild(li);
        });
      } else {
        alert(messages.keywordNotFound);
      }
    } catch (error) {
      alert(messages.loadingError);
    }
  }