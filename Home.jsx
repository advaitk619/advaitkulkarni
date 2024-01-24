import React, { useState, useEffect } from 'react';
import download from "./pics/download.jpeg";
const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedBlogId, setExpandedBlogId] = useState(null); 
  const [commentsExpanded, setCommentsExpanded] = useState({}); 
  const blogsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseBlogs = await fetch('https://jsonplaceholder.typicode.com/posts');
        const dataBlogs = await responseBlogs.json();
        setBlogs(dataBlogs);

        const commentsPromises = dataBlogs.map(blog => fetch(`https://jsonplaceholder.typicode.com/posts/1/comments/?postId=${blog.id}`).then(response => response.json()));
        const commentsData = await Promise.all(commentsPromises);
      
        const commentsMap = {};
        commentsData.forEach(commentList => {
          const blogId = commentList[0]?.postId;
          commentsMap[blogId] = commentList;
        });

        setComments(commentsMap);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // Calculate the indexes of the blogs to display for the current page
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const toggleComments = blogId => {
    setExpandedBlogId(expandedId => (expandedId === blogId ? null : blogId));
    setCommentsExpanded(prevCommentsExpanded => ({
      ...prevCommentsExpanded,
      [blogId]: !prevCommentsExpanded[blogId],
    }));
  };

  const handleLike = blogId => {
    setLikes(prevLikes => ({
      ...prevLikes,
      [blogId]: (prevLikes[blogId] || 0) + 1,
    }));
  };

  const renderBlogList = currentBlogs.map(blog => (
    <div id="s1" key={blog.id}>
            <h1 id='s2'>{blog.id}</h1>
            <div id='s3'>
            <h2>{blog.title}</h2>
            </div>
            <div id='s4'>
            <img src={download} alt='logo'/>
            </div>           
            <div id='s5'>
              <h3>{blog.body}</h3>
            </div>
            <div id ="s6">
            <button onClick={() => toggleComments(blog.id)} className={commentsExpanded[blog.id] ? 'expanded' : ''}>Comments</button>
        <button onClick={() => handleLike(blog.id)}><span role="img" aria-label="Heart" style={{ color: 'red' }}>
            ❤️
          </span></button>
        Likes: {likes[blog.id] || 0}
      </div>
      {commentsExpanded[blog.id] && (
        <div>
          
          <ul>
            {comments[blog.id]?.map(comment => (
              <li key={comment.id}>{comment.body}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  ));

//   return (
//     <div>
//       <h1>Blog List</h1>
//       {renderBlogList}
//       <div>
//         <button onClick={() => setCurrentPage(prevPage => prevPage - 1)} disabled={currentPage === 1}>
//           Previous Page
//         </button>
//         <button onClick={() => setCurrentPage(prevPage => prevPage + 1)} disabled={currentBlogs.length < blogsPerPage}>
//           Next Page
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BlogList;


const totalPages = Math.ceil(blogs.length / blogsPerPage);

const handlePageChange = newPage => {
  setCurrentPage(newPage);
  setExpandedBlogId(null);
  setCommentsExpanded({}); 
};

// Display only 5 page numbers at a time
const displayPageNumbers = () => {
  const totalPageNumbersToShow = 5;
  const middlePage = Math.ceil(totalPageNumbersToShow / 2);

  let startPage;
  if (currentPage <= middlePage || totalPages <= totalPageNumbersToShow) {
    startPage = 1;
  } else if (currentPage + middlePage - 1 >= totalPages) {
    startPage = totalPages - totalPageNumbersToShow + 1;
  } else {
    startPage = currentPage - middlePage + 1;
  }

  return Array.from({ length: totalPageNumbersToShow }, (_, index) => startPage + index);
};

return (
  <div>
    <h1>Blog List</h1>
    {renderBlogList}
    <div>
      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous Page
      </button>
      {displayPageNumbers().map(page => (
        <button key={page} onClick={() => handlePageChange(page)} disabled={page === currentPage}>
          {page}
        </button>
      ))}
      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentBlogs.length < blogsPerPage}>
        Next Page
      </button>
    </div>
  </div>
);
};

export default BlogList;
