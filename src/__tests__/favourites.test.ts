import { describe, it, expect } from 'vitest';
import {
  ensureFeedbackHubAtBottom,
  reorderFavourites,
  toggleFavouriteArray
} from '../utils/engines';

describe('Favourites Bottom-Pinning & Reordering Helpers', () => {
  describe('ensureFeedbackHubAtBottom', () => {
    it('should keep feedback-hub at the bottom when it is in the array', () => {
      const favs = ['feedback-hub', 'base64-converter', 'uuid-generator'];
      const result = ensureFeedbackHubAtBottom(favs);
      expect(result).toEqual(['base64-converter', 'uuid-generator', 'feedback-hub']);
    });

    it('should do nothing if feedback-hub is not present', () => {
      const favs = ['base64-converter', 'uuid-generator'];
      const result = ensureFeedbackHubAtBottom(favs);
      expect(result).toEqual(['base64-converter', 'uuid-generator']);
    });

    it('should handle empty arrays correctly', () => {
      expect(ensureFeedbackHubAtBottom([])).toEqual([]);
    });
  });

  describe('reorderFavourites', () => {
    it('should move an item up when direction is up and index > 0', () => {
      const favs = ['base64-converter', 'uuid-generator', 'feedback-hub'];
      const result = reorderFavourites(favs, 'uuid-generator', 'up');
      expect(result).toEqual(['uuid-generator', 'base64-converter', 'feedback-hub']);
    });

    it('should not move an item up if it is already at index 0', () => {
      const favs = ['base64-converter', 'uuid-generator', 'feedback-hub'];
      const result = reorderFavourites(favs, 'base64-converter', 'up');
      expect(result).toEqual(['base64-converter', 'uuid-generator', 'feedback-hub']);
    });

    it('should move an item down when direction is down and index < length - 1', () => {
      const favs = ['base64-converter', 'uuid-generator', 'xml-formatter', 'feedback-hub'];
      const result = reorderFavourites(favs, 'uuid-generator', 'down');
      expect(result).toEqual(['base64-converter', 'xml-formatter', 'uuid-generator', 'feedback-hub']);
    });

    it('should not move an item down if the next item is feedback-hub', () => {
      const favs = ['base64-converter', 'uuid-generator', 'feedback-hub'];
      const result = reorderFavourites(favs, 'uuid-generator', 'down');
      expect(result).toEqual(['base64-converter', 'uuid-generator', 'feedback-hub']);
    });

    it('should not move an item down if it is already at the last index', () => {
      const favs = ['base64-converter', 'uuid-generator'];
      const result = reorderFavourites(favs, 'uuid-generator', 'down');
      expect(result).toEqual(['base64-converter', 'uuid-generator']);
    });

    it('should ignore reorder commands for non-existent tools', () => {
      const favs = ['base64-converter', 'uuid-generator'];
      const result = reorderFavourites(favs, 'invalid-tool', 'up');
      expect(result).toEqual(['base64-converter', 'uuid-generator']);
    });
  });

  describe('Integration with toggleFavouriteArray', () => {
    it('should successfully toggle a tool and keep feedback-hub at the bottom', () => {
      let favs = ['base64-converter', 'feedback-hub'];
      // Toggle on a new favourite
      favs = toggleFavouriteArray(favs, 'uuid-generator');
      favs = ensureFeedbackHubAtBottom(favs);
      expect(favs).toEqual(['base64-converter', 'uuid-generator', 'feedback-hub']);

      // Toggle off a favourite
      favs = toggleFavouriteArray(favs, 'base64-converter');
      favs = ensureFeedbackHubAtBottom(favs);
      expect(favs).toEqual(['uuid-generator', 'feedback-hub']);
    });
  });
});
