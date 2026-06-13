/**
 * Local extractive summarizer - no external API, no quota limits
 * Picks the most important sentences from the notes based on word frequency
 */
const generateAISummary = async ({ title, clientName, notes }) => {
  if (!notes || notes.trim().length === 0) {
    throw new Error(
      'Cannot generate AI summary: recording notes are empty. Please add notes or a transcript first.'
    );
  }

  const sentences = notes
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length <= 4) {
    return `Summary for "${title}" (${clientName}):\n\n${notes.trim()}`;
  }

  const stopwords = new Set([
    'the','a','an','is','are','was','were','to','of','and','in','on','for',
    'with','they','we','it','this','that','their','have','has','be','as','at',
  ]);

  const freq = {};
  sentences.forEach((s) => {
    s.toLowerCase().match(/\b[a-z]+\b/g)?.forEach((word) => {
      if (!stopwords.has(word)) {
        freq[word] = (freq[word] || 0) + 1;
      }
    });
  });

  const scored = sentences.map((s, idx) => {
    const words = s.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const score = words.reduce((sum, w) => sum + (freq[w] || 0), 0) / (words.length || 1);
    return { sentence: s.trim(), score, idx };
  });

  const topCount = Math.max(2, Math.min(6, Math.ceil(sentences.length * 0.4)));
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topCount)
    .sort((a, b) => a.idx - b.idx);

  const summaryBody = top.map((s) => `• ${s.sentence}`).join('\n');

  return `Summary for "${title}" (${clientName}):\n\n${summaryBody}`;
};

module.exports = { generateAISummary };