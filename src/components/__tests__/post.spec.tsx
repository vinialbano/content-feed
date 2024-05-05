import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Post from '../post';

describe('Post Component', () => {
  const mockPost = {
    title: 'Sample Post',
    subTitle: 'An interesting subtitle',
    body: 'This is a longer text that should expand when clicked. It contains several sentences that will be hidden initially and only shown when the button is clicked.',
    author: 'John Doe',
    publishDate: new Date(),
    imageUri: 'https://picsum.photos/500/500',
    comments: [],
  };

  it('should initially show limited text and expand when show more is clicked', () => {
    render(<Post {...mockPost} />);

    // Check initial state with limited text
    const initialText = screen.getByText(
      /This is a longer text that should expand when clicked\./i,
    );
    expect(initialText).toBeInTheDocument();

    // Simulate clicking on the 'Show More' button/link
    const showMoreButton = screen.getByText(/Show more/);
    fireEvent.click(showMoreButton);

    // Check if the text has expanded
    const expandedText = screen.getByText(
      /This is a longer text that should expand when clicked. It contains several sentences that will be hidden initially and only shown when the button is clicked\./,
    );
    expect(expandedText).toBeInTheDocument();

    // Optionally, you can check if a 'Show Less' link appears and test it similarly
    const showLessButton = screen.queryByText(/Show less/);
    if (showLessButton) {
      fireEvent.click(showLessButton);
      expect(initialText).toBeInTheDocument(); // Ensure it returns to the initial limited text state
    }
  });
});
