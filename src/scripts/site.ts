type SearchDocument = {
  title: string;
  description: string;
  text: string;
  tags: string[];
  date: string;
  url: string;
};

const root = document.documentElement;
const navToggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const menu = document.querySelector<HTMLElement>('[data-site-menu]');
const searchLayer = document.querySelector<HTMLElement>('[data-search-layer]');
const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
const searchResults = document.querySelector<HTMLElement>('[data-search-results]');
let searchDocuments: SearchDocument[] | null = null;

function closeMenu() {
  navToggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('is-open');
}

navToggle?.addEventListener('click', () => {
  const willOpen = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(willOpen));
  menu?.classList.toggle('is-open', willOpen);
});
menu?.addEventListener('click', closeMenu);

document.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('ai-composer-theme', next);
});

function closeSearch() {
  if (!searchLayer) return;
  searchLayer.hidden = true;
  document.body.classList.remove('has-dialog');
}

function renderSearchResults(matches: SearchDocument[]) {
  if (!searchResults) return;
  searchResults.replaceChildren();
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'search-empty';
    empty.textContent = '没有匹配结果，换个关键词试试。';
    searchResults.append(empty);
    return;
  }
  matches.forEach((item) => {
    const link = document.createElement('a');
    link.className = 'search-result';
    link.href = item.url;
    const time = document.createElement('time');
    time.textContent = item.date;
    const title = document.createElement('strong');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description;
    link.append(time, title, description);
    searchResults.append(link);
  });
}

async function openSearch() {
  if (!searchLayer || !searchInput) return;
  searchLayer.hidden = false;
  document.body.classList.add('has-dialog');
  searchInput.focus();
  if (searchDocuments) return;
  try {
    const response = await fetch(searchLayer.dataset.indexUrl ?? './search.json');
    if (!response.ok) throw new Error(`Search index returned ${response.status}`);
    searchDocuments = await response.json();
  } catch {
    searchDocuments = [];
    if (searchResults) searchResults.textContent = '搜索索引加载失败，请稍后重试。';
  }
}

document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
document.querySelectorAll('[data-search-close]').forEach((button) => button.addEventListener('click', closeSearch));

searchInput?.addEventListener('input', () => {
  if (!searchDocuments || !searchResults) return;
  const query = searchInput.value.trim().toLocaleLowerCase('zh-CN');
  if (!query) {
    searchResults.innerHTML = '<p class="search-empty">输入关键词开始搜索。</p>';
    return;
  }
  const matches = searchDocuments.filter((item) =>
    [item.title, item.description, item.text, ...item.tags].join(' ').toLocaleLowerCase('zh-CN').includes(query)
  ).slice(0, 10);
  renderSearchResults(matches);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeSearch(); closeMenu(); }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    void openSearch();
  }
});

const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
if (progress && document.body.classList.contains('is-post')) {
  const updateProgress = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
}

const toc = document.querySelector<HTMLElement>('[data-toc]');
if (toc) {
  const headings = [...document.querySelectorAll<HTMLElement>('.article-content h2, .article-content h3')];
  if (!headings.length) toc.textContent = '这篇文章没有分节。';
  headings.forEach((heading) => {
    const link = document.createElement('a');
    link.className = `toc-${heading.tagName.toLowerCase()}`;
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    toc.append(link);
  });
}

document.querySelector<HTMLButtonElement>('[data-copy-url]')?.addEventListener('click', async (event) => {
  await navigator.clipboard.writeText(window.location.href);
  (event.currentTarget as HTMLButtonElement).textContent = '已复制';
});

document.querySelectorAll<HTMLPreElement>('.article-content pre').forEach((pre) => {
  const button = document.createElement('button');
  button.className = 'copy-code';
  button.type = 'button';
  button.textContent = 'COPY';
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(pre.querySelector('code')?.textContent ?? '');
    button.textContent = 'COPIED';
    window.setTimeout(() => { button.textContent = 'COPY'; }, 1600);
  });
  pre.append(button);
});
