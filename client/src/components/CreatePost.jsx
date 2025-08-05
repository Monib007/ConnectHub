import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const response = await axios.post('/posts', { content: content.trim() });
      setContent('');
      onPostCreated(response.data);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="form-control"
              rows="3"
              maxLength="1000"
              disabled={isPosting}
            />
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <small className="text-muted">
              {content.length}/1000 characters
            </small>
            <button
              type="submit"
              disabled={!content.trim() || isPosting}
              className="btn btn-primary d-flex align-items-center"
            >
              <PaperAirplaneIcon className="me-2" style={{width: '20px', height: '20px'}} />
              <span>{isPosting ? 'Posting...' : 'Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 