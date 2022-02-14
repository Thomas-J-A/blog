import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="create-post">
      <form>
        <h2>Create Post</h2>
        <p>Definitely do not plagiarize</p>

        <label htmlFor="create-post_title">Title</label>
        <input type="text" id="create-post_title" />
        <label hmtlFor="create-post_content">Content</label>
        <textarea 
          id="create-post_content" 
          // placeholder=''
          // value={}
          // onChange={}
        />
        <label>
          <input 
            type="checkbox" 
            id="create-post_publish" 
            // checked={isChecked} Boolean, in place of 'value'
            // onChange={}
          />
          Publish Now
        </label>
        <button type="submit">POST</button>
      </form>
    </div>
  );
};

export default CreatePost;
