import { useState, useRef } from 'react';
import { PaperAirplaneIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!content.trim() && imageFiles.length === 0) || isPosting) return;

    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append('content', content.trim());
      formData.append('isPublic', isPublic);
      
      if (tags.trim()) {
        formData.append('tags', tags.trim());
      }
      
      if (location.trim()) {
        formData.append('location', location.trim());
      }

      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('FormData content:', {
        content: content.trim(),
        tags: tags.trim(),
        location: location.trim(),
        isPublic,
        imageCount: imageFiles.length
      });
      
      const response = await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setContent('');
      setImages([]);
      setImageFiles([]);
      setTags('');
      setLocation('');
      setIsPublic(true);
      
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

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mb-3">
              <div className="row g-2">
                {images.map((image, index) => (
                  <div key={index} className="col-md-4 col-6 position-relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="img-fluid rounded"
                      style={{ height: '120px', width: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                      style={{ width: '24px', height: '24px', padding: 0 }}
                    >
                      <XMarkIcon style={{width: '14px', height: '14px'}} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Options */}
          <div className="row mb-3">
            <div className="col-md-6">
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Add tags (comma separated)"
                className="form-control form-control-sm"
                maxLength="100"
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location"
                className="form-control form-control-sm"
                maxLength="100"
              />
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="privacyToggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="privacyToggle">
                {isPublic ? '🌍 Public Post' : '🔒 Private Post'}
              </label>
            </div>
          </div>
          
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <small className="text-muted me-3">
                {content.length}/1000 characters
              </small>
              <div className="progress me-3" style={{width: '100px', height: '6px'}}>
                <div 
                  className="progress-bar" 
                  style={{width: `${(content.length / 1000) * 100}%`}}
                ></div>
              </div>
              
              {/* Image Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn-outline-primary btn-sm me-2"
                disabled={isPosting || images.length >= 5}
              >
                <PhotoIcon style={{width: '16px', height: '16px'}} />
                {images.length > 0 && ` (${images.length}/5)`}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
            </div>
            
            <button
              type="submit"
              disabled={(!content.trim() && imageFiles.length === 0) || isPosting}
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