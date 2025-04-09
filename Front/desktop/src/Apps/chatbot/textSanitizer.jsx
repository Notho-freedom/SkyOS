export const sanitizeTextForTTS = (text) => {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/[^À-ſa-zA-Z0-9\s.,!?"'()\-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };