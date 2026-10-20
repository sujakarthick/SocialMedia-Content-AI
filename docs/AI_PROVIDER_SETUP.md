# AI Provider (Google Gemini & OpenAI) Configuration Guide

## 1. Overview
NammaContent AI uses Google Gemini 1.5/2.0 Flash as its primary generative engine, tuned for nuanced South Indian languages:
- **தமிழ் (Tamil)**: Natural, persuasive native script without robotic machine translations.
- **Tanglish**: Colloquial Tamil written using the Latin/English alphabet with authentic regional expressions (*"Vera level"*, *"Semmayaana combo"*, *"Marakkama vaanga"*).
- **English**: High-converting Indian commercial copy.

## 2. Setting Up Google Gemini API
1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google Account and click **Create API Key**.
3. Copy your key and add it to `.env.local`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```

## 3. Graceful Fallback & Development Mode
If `GEMINI_API_KEY` is not present, NammaContent AI automatically operates in **Intelligent Mock Mode**:
- Generates culturally authentic, industry-specific Tamil, Tanglish, and English copy.
- Returns `is_mock: true` and displays a yellow `[Mock Demo Mode]` badge in the UI.
- Never fabricates or deceives the user.
