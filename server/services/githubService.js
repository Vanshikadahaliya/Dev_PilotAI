import axios from 'axios';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github.v3+json' },
});

export const exchangeCodeForToken = async (code, clientId, clientSecret) => {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  });

  const { data } = await axios.post(
    'https://github.com/login/oauth/access_token',
    body.toString(),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data.access_token;
};

export const getGitHubUser = async (accessToken) => {
  const { data } = await githubApi.get('/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

export const getUserRepositories = async (accessToken, page = 1, perPage = 100) => {
  const { data } = await githubApi.get('/user/repos', {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: {
      sort: 'updated',
      direction: 'desc',
      per_page: perPage,
      page,
      affiliation: 'owner',
    },
  });
  return data;
};

export const getRepositoryContents = async (accessToken, owner, repo, path = '') => {
  const { data } = await githubApi.get(`/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

export const getRepositoryTree = async (accessToken, owner, repo, branch = 'main') => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}/git/trees/${branch}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { recursive: 1 },
    });
    return data.tree || [];
  } catch {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const defaultBranch = data.default_branch || 'main';
    const treeRes = await githubApi.get(`/repos/${owner}/${repo}/git/trees/${defaultBranch}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { recursive: 1 },
    });
    return treeRes.data.tree || [];
  }
};

export const getRepositoryLanguages = async (accessToken, owner, repo) => {
  const { data } = await githubApi.get(`/repos/${owner}/${repo}/languages`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return data;
};

export const getReadmeContent = async (accessToken, owner, repo) => {
  try {
    const { data } = await githubApi.get(`/repos/${owner}/${repo}/readme`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return content;
  } catch {
    return null;
  }
};

export const analyzeRepository = async (accessToken, owner, repo) => {
  const [tree, languages, readme, repoInfo] = await Promise.all([
    getRepositoryTree(accessToken, owner, repo),
    getRepositoryLanguages(accessToken, owner, repo),
    getReadmeContent(accessToken, owner, repo),
    githubApi.get(`/repos/${owner}/${repo}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }).then((r) => r.data),
  ]);

  const filePaths = tree
    .filter((item) => item.type === 'blob')
    .map((item) => item.path)
    .slice(0, 200);

  const topLanguages = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  const configFiles = filePaths.filter((p) =>
    /package\.json|requirements\.txt|Cargo\.toml|go\.mod|pom\.xml|dockerfile|docker-compose/i.test(p)
  );

  const hasTests = filePaths.some((p) => /test|spec|__tests__/i.test(p));
  const hasCI = filePaths.some((p) => /\.github\/workflows|\.gitlab-ci|jenkinsfile/i.test(p));
  const hasDocker = filePaths.some((p) => /dockerfile|docker-compose/i.test(p));

  return {
    name: repoInfo.name,
    description: repoInfo.description,
    fullName: repoInfo.full_name,
    stars: repoInfo.stargazers_count,
    forks: repoInfo.forks_count,
    language: repoInfo.language,
    topics: repoInfo.topics || [],
    defaultBranch: repoInfo.default_branch,
    filePaths,
    topLanguages,
    configFiles,
    hasTests,
    hasCI,
    hasDocker,
    existingReadme: readme,
    homepage: repoInfo.homepage,
  };
};
