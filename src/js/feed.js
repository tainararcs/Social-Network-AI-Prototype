// js/feed.js
import { prepararPostParaFeed } from './posts.js';
import { User } from './User.js';

const generatePostBtn = document.getElementById('generatePostBtn');
const logoutBtn = document.getElementById('logoutBtn');
const feedContainer = document.getElementById('feed-container');
const initialLoadingMessage = document.getElementById('initial-loading-message');
const userDisplayName = document.getElementById('user-display-name');

const NUMBER_OF_POSTS_TO_GENERATE = 20;
const INTERVAL_BETWEEN_POSTS_MS = 2500;

let currentUser;
const storedUser = localStorage.getItem('user');

if (storedUser) {
  const userData = JSON.parse(storedUser);
  currentUser = new User(
    userData.id || Math.floor(Math.random() * 1000) + 1,
    userData.name || "Usuário Generativo",
    userData.email || "email@example.com",
    userData.senha || "defaultpass"
  );
  if (userData.interests && Array.isArray(userData.interests) && userData.interests.length > 0) {
    currentUser.addInterestList(userData.interests);
  } else {
    currentUser.addInterestList(["tecnologia", "inovação", "futuro", "inteligencia artificial", "curiosidades"]);
  }
  userDisplayName.textContent = currentUser.getName();
} else {
  alert("Você precisa estar logado para acessar o feed. Redirecionando para o login.");
  window.location.href = 'index.html';
}

function addPostToFeedDOM(postData) {
  if (initialLoadingMessage && initialLoadingMessage.parentNode) {
    initialLoadingMessage.remove();
  }

  const postCard = document.createElement('div');
  postCard.className = 'post-card';
  const postTime = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

  postCard.innerHTML = `
    <div class="post-header">
      <img src="${postData.avatarUrl}" alt="${postData.nomeUsuario}" class="post-avatar" onerror="this.onerror=null; this.src='https://via.placeholder.com/40'">
      <span class="post-username">${postData.nomeUsuario}</span>
      <span class="post-time">${postTime}</span>
    </div>
    <p class="post-content">${postData.conteudo}</p>
    <p class="post-hashtags">${postData.hashtags}</p>
  `;
  feedContainer.prepend(postCard);
}

async function generateAndAddSinglePost() {
  const generatingMessage = document.createElement('p');
  generatingMessage.className = 'generating-message active';
  generatingMessage.textContent = 'Gerando post...';
  feedContainer.prepend(generatingMessage);

  try {
    const post = await prepararPostParaFeed(currentUser);
    generatingMessage.remove();

    if (post) {
      addPostToFeedDOM(post);
    } else {
      const errorCard = document.createElement('div');
      errorCard.className = 'post-card error-card';
      errorCard.innerHTML = `<p class="post-content" style="color: red;">Erro ao gerar o post.</p>`;
      feedContainer.prepend(errorCard);
    }
  } catch (error) {
    generatingMessage.remove();
    const errorCard = document.createElement('div');
    errorCard.className = 'post-card error-card';
    errorCard.innerHTML = `<p class="post-content" style="color: red;">Erro inesperado: ${error.message}</p>`;
    feedContainer.prepend(errorCard);
  }
}

async function startAutomaticPostGeneration(count, interval) {
  generatePostBtn.disabled = true;

  for (let i = 0; i < count; i++) {
    await generateAndAddSinglePost();
    if (i < count - 1) {
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  generatePostBtn.disabled = false;
  generatePostBtn.textContent = 'Gerar post teste';
}

generatePostBtn.addEventListener('click', generateAndAddSinglePost);

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});

document.addEventListener('DOMContentLoaded', () => {
  if (currentUser) {
    startAutomaticPostGeneration(NUMBER_OF_POSTS_TO_GENERATE, INTERVAL_BETWEEN_POSTS_MS);
  }
});
