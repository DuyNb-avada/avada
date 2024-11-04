const axios = require("axios");

const LEAST_COMMENTS = 51;

async function fetchData() {
  try {
    const usersResponse = await axios.get("https://jsonplaceholder.typicode.com/users");
    const commentsResponse = await axios.get("https://jsonplaceholder.typicode.com/comments");
    const postsResponse = await axios.get("https://jsonplaceholder.typicode.com/posts");
    const postId1Response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    const commnetsForPostId1Response = await axios.get("https://jsonplaceholder.typicode.com/comments?postId=1");

  
    const users = usersResponse.data;
    const comments = commentsResponse.data;
    const posts = postsResponse.data;
    const postId1 = postId1Response.data;
    const commnetsForPostId1 = commnetsForPostId1Response.data;
    
  
    // user map with comment and post
    users.map((user) => {
      user.posts = posts.filter(post => user.id === post.userId)
      user.comments = comments.filter(comment => 
        user.posts.some(post => post.id === comment.postId)
      )
      return user
    });

    // Filter only users with more than 3 comments.
    const usersFilter = users.filter(user => user.comments.length >= LEAST_COMMENTS);

    // Reformat the data with the count of comments and posts
    users.map((user) => {
      user.commentsCount = user.comments.length;
      user.postsCount = user.posts.length;
      delete user.comments;
      delete user.posts;
      delete user.address;
      delete user.phone;
      delete user.website;
      delete user.company;
      return user
    });

    // Get the user with the most comments/posts
    const userWithTheMost = users.reduce((max, user) => {
      return (user.commentsCount + user.postsCount) > (max.commentsCount + max.postsCount) ? user : max;
    }); 

    //Sort the list of users by the postsCount value descending
    users.sort((a, b) => b.postsCount - a.postsCount);

    // The post with ID of 1 data
    postId1.comments = commnetsForPostId1;

  
    // console.log(postId1);
    console.log(users);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData()