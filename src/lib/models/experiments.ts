export const experimentSchemaVersion = 2;

export function titleFromPrompt(prompt: string) {
  const compact = prompt.trim().replace(/\s+/g, " ");
  if (!compact) {
    return "Untitled experiment";
  }

  return compact.length > 64 ? `${compact.slice(0, 64)}...` : compact;
}
