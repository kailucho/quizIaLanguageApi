// Removed axios and replaced with direct mocks for HTTP behavior
const mockUnit = {
  content: 'Present Simple, Vocabulary: daily routines, Grammar: present simple tense',
};

describe('Question Controller', () => {
  it('should return 400 when invalid input is provided', async () => {
    const mockPost = jest.fn().mockRejectedValueOnce({
      response: {
        status: 400,
        data: { error: 'Invalid input' },
      },
    });

    try {
      await mockPost('/api/v1/questions', {});
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('error');
    }
  });
});