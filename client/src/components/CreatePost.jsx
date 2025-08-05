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
    <div className="card shadow-sm mb-4 hover-lift">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
            <span className="text-white fw-bold">✍️</span>
          </div>
          <div>
            <h6 className="mb-0 fw-bold">Share your thoughts</h6>
            <small className="text-muted">What's on your mind today?</small>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something amazing with the community... ✨"
              className="form-control"
              rows="4"
              maxLength="1000"
              disabled={isPosting}
              style={{ resize: 'none' }}
            />
          </div>
          
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <small className="text-muted me-3">
                {content.length}/1000 characters
              </small>
              <div className="progress" style={{width: '100px', height: '6px'}}>
                <div 
                  className="progress-bar" 
                  style={{width: `${(content.length / 1000) * 100}%`}}
                ></div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim() || isPosting}
              className="btn btn-primary d-flex align-items-center hover-lift"
            >
              {isPosting ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="me-2" style={{width: '20px', height: '20px'}} />
                  <span>Share Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost; 