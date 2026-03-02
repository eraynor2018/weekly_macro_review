import Anthropic from '@anthropic-ai/sdk';

export function createAnthropicClient(userApiKey?: string): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY || userApiKey;
  if (!key) {
    throw new Error(
      'No Anthropic API key available. Set ANTHROPIC_API_KEY env var or provide one in Settings.'
    );
  }
  return new Anthropic({ apiKey: key });
}
