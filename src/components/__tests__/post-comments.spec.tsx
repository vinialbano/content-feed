import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PostComments from '../post-comments';

// Mock the PostComment component if necessary
jest.mock('../post-comment', () => {
  return function DummyPostComment(props: any) {
    return (
      <div>
        {props.author}: {props.body}
      </div>
    );
  };
});

describe('PostComments', () => {
  const mockComments = [
    {
      body: 'This is a great post!',
      author: 'John Doe',
      profilePic: 'url-to-image',
      likes: 10,
    },
    {
      body: 'Thanks for sharing!',
      author: 'Jane Doe',
      profilePic: 'url-to-image',
      likes: 5,
    },
  ];

  it('should initially hide comments and show them on button click', () => {
    render(<PostComments comments={mockComments} />);

    // Initially, the button should be visible and the comments should not
    const button = screen.getByRole('button', { name: /show comments/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByText(/This is a great post!/)).not.toBeInTheDocument();

    // Click the button to show comments
    fireEvent.click(button);

    // After clicking, the comments should be visible
    expect(screen.queryByText(/This is a great post!/)).toBeInTheDocument();
    expect(screen.queryByText(/Thanks for sharing!/)).toBeInTheDocument();
    expect(button).not.toBeInTheDocument(); // The button should now be gone
  });
});
