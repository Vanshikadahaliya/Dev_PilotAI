import axios from 'axios';
import { env } from '../config/env.js';

const extractAxiosError = (error, provider) => {
  const apiError = error.response?.data?.error;
  if (apiError?.message) return apiError.message;
  if (typeof error.response?.data?.message === 'string') return error.response.data.message;
  if (error.response?.status === 401) return `${provider} API key is invalid or unauthorized`;
  if (error.response?.status === 429) return `${provider} rate limit or quota exceeded`;
  return error.message || `${provider} request failed`;
};

const callOpenAI = async (systemPrompt, userPrompt) => {
  const { apiKey, model } = env.ai.openai || {};

  if (!apiKey || apiKey.includes('your_') || apiKey.includes('your-')) {
    throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in server/.env');
  }

  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenAI returned an empty response');
    }

    return data.choices[0].message.content;
  } catch (error) {
    throw new Error(extractAxiosError(error, 'OpenAI'));
  }
};

const callOpenRouter = async (systemPrompt, userPrompt) => {
  const { apiKey, model } = env.ai.openrouter || {};

  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured. Set OPENROUTER_API_KEY in server/.env');
  }

  try {
    const { data } = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('OpenRouter returned an empty response');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('[AI][OpenRouter] error response:', error.response?.data || error.message);
    const respErr = error.response?.data?.error?.message || error.response?.data?.message;
    if (respErr) {
      throw new Error(`OpenRouter API error: ${respErr}`);
    }
    throw new Error(extractAxiosError(error, 'OpenRouter'));
  }
};

const callGemini = async (systemPrompt, userPrompt) => {
  const { apiKey, model } = env.ai.gemini || {};

  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Set GEMINI_API_KEY in server/.env');
  }

  try {
    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (data.error?.message) {
      throw new Error(data.error.message);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini returned an empty response');
    }
    return text;
  } catch (error) {
    if (error.message && !error.response) throw error;
    throw new Error(extractAxiosError(error, 'Gemini'));
  }
};

export const generateAIResponse = async (systemPrompt, userPrompt) => {
  const provider = (env.ai.provider || 'openai').toLowerCase();

  if (provider === 'gemini') return callGemini(systemPrompt, userPrompt);

  if (provider === 'openrouter') {
    try {
      return await callOpenRouter(systemPrompt, userPrompt);
    } catch (err) {
      const msg = String(err?.message || '').toLowerCase();
      // If OpenRouter indicates the user/key is not found/authorized, try OpenAI as a fallback
      if (
  msg.includes('user not found') ||
  msg.includes('unauthorized') ||
  msg.includes('401')
) {
        console.warn('[AI] OpenRouter failed with authorization error, attempting fallback to OpenAI:', err.message);
        const openaiApiKey = env.ai.openai?.apiKey;
        if (!openaiApiKey || openaiApiKey.includes('your_') || openaiApiKey.includes('your-')) {
          throw new Error(`OpenRouter API error: ${err.message}. No OpenAI fallback configured — set OPENAI_API_KEY in server/.env or switch AI_PROVIDER to openai`);
        }
        return callOpenAI(systemPrompt, userPrompt);
      }
      throw err;
    }
  }

  return callOpenAI(systemPrompt, userPrompt);
};

const README_SYSTEM = `You are an expert technical writer specializing in GitHub README files.
Generate professional, well-structured README markdown.
Use proper markdown formatting with headers, code blocks, badges placeholders, and tables where appropriate.
Be specific to the project based on the provided analysis. Do not use generic filler text.`;

export const generateReadme = async (repoAnalysis) => {
  const userPrompt = `Generate a complete professional README.md for this repository:

Repository: ${repoAnalysis.fullName}
Description: ${repoAnalysis.description || 'No description provided'}
Primary Language: ${repoAnalysis.language || 'Unknown'}
Languages: ${repoAnalysis.topLanguages.join(', ') || 'Unknown'}
Topics: ${repoAnalysis.topics.join(', ') || 'None'}
Stars: ${repoAnalysis.stars} | Forks: ${repoAnalysis.forks}
Has Tests: ${repoAnalysis.hasTests} | Has CI: ${repoAnalysis.hasCI} | Has Docker: ${repoAnalysis.hasDocker}
Config Files: ${repoAnalysis.configFiles.join(', ') || 'None'}

Key files in repo:
${repoAnalysis.filePaths.slice(0, 50).join('\n')}

${repoAnalysis.existingReadme ? `Existing README (improve upon this):\n${repoAnalysis.existingReadme.slice(0, 2000)}` : ''}

Include these sections:
1. Project Title with badges placeholder
2. Overview
3. Features (detect from file structure)
4. Installation
5. Usage with code examples
6. Tech Stack
7. Folder Structure (based on actual files)
8. Screenshots placeholder
9. Contributing
10. License

Return ONLY the markdown content, no wrapping code fences.`;

  return generateAIResponse(README_SYSTEM, userPrompt);
};

const DESCRIPTION_SYSTEM = `You are a career coach and technical writer.
Generate compelling project descriptions for different contexts.
Return valid JSON only with keys: short, medium, linkedin, resume.`;

export const generateDescription = async (repoAnalysis) => {
  const userPrompt = `Generate project descriptions for:

Repository: ${repoAnalysis.fullName}
Description: ${repoAnalysis.description || 'No description'}
Languages: ${repoAnalysis.topLanguages.join(', ')}
Topics: ${repoAnalysis.topics.join(', ')}

Return JSON:
{
  "short": "1-2 sentence elevator pitch (max 160 chars)",
  "medium": "3-4 sentence description for GitHub/portfolio",
  "linkedin": "Professional LinkedIn post style description",
  "resume": "Bullet-point style for resume (2-3 bullets)"
}`;

  const response = await generateAIResponse(DESCRIPTION_SYSTEM, userPrompt);
  return parseJsonResponse(response);
};

const PORTFOLIO_SYSTEM = `You are a web developer creating portfolio websites.
Generate a complete, modern, dark-themed portfolio HTML page.
Use inline CSS only. Make it responsive and professional.
Return valid JSON with keys: html, skills (array), projects (array of {name, description, tech, url}).`;

export const generatePortfolio = async (userProfile, repositories) => {
  const repoSummary = repositories
    .slice(0, 10)
    .map((r) => `- ${r.fullName}: ${r.description || 'No description'} (${r.language}, ⭐${r.stars})`)
    .join('\n');

  const userPrompt = `Create a portfolio for this developer:

Name: ${userProfile.username}
Avatar: ${userProfile.avatar}
Bio/Email: ${userProfile.email || 'Not provided'}

Top Repositories:
${repoSummary}

Generate a complete single-page HTML portfolio with:
- Hero section with name and tagline
- Skills section (inferred from repos)
- Projects section (from repos)
- Contact section
- Dark theme (#0F172A background, #6366F1 accent)

Return JSON:
{
  "html": "<complete HTML string>",
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "", "description": "", "tech": [], "url": ""}]
}`;

  const response = await generateAIResponse(PORTFOLIO_SYSTEM, userPrompt);
  return parseJsonResponse(response);
};

const PR_SYSTEM = `You are a senior software engineer reviewing pull requests.
Provide clear, actionable PR summaries.
Return valid JSON only.`;

export const summarizePR = async (prDescription, changedFiles) => {
  const userPrompt = `Summarize this pull request:

PR Description:
${prDescription || 'No description provided'}

Changed Files:
${Array.isArray(changedFiles) ? changedFiles.join('\n') : changedFiles}

Return JSON:
{
  "executiveSummary": "2-3 sentence overview",
  "keyChanges": ["change1", "change2"],
  "risks": ["risk1", "risk2"],
  "improvements": ["suggestion1", "suggestion2"]
}`;

  const response = await generateAIResponse(PR_SYSTEM, userPrompt);
  return parseJsonResponse(response);
};

const BUG_SYSTEM = `You are an expert debugger and software engineer.
Analyze errors and provide clear explanations and fixes.
Return valid JSON only.`;

export const explainBug = async (errorMessage, stackTrace) => {
  const userPrompt = `Explain this bug:

Error Message:
${errorMessage}

Stack Trace:
${stackTrace || 'Not provided'}

Return JSON:
{
  "rootCause": "Clear explanation of root cause",
  "explanation": "Detailed explanation in plain language",
  "fixSuggestions": ["fix1", "fix2", "fix3"],
  "exampleSolution": "Code example showing the fix"
}`;

  const response = await generateAIResponse(BUG_SYSTEM, userPrompt);
  return parseJsonResponse(response);
};

function parseJsonResponse(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('AI response did not contain valid JSON');
  }
  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Failed to parse AI response as JSON');
  }
}
