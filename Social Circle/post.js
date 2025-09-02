const grid = document.querySelector('.post-container');
const loadMoreBtn = document.getElementById('loadMoreBtn');

let limit = 9;
let skip = 0;
let total = Infinity;
let loading = false;
let postsInitialized = false;



async function fetchAllPosts(limit, skip){
    const response = await fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}`);
    if(!response.ok)
        throw new Error ("Failed to fetch posts.")
    return response.json();  //this will return { posts, total, skip, limit }
}

async function fetchCommentsForPost(postId){
  const response = await fetch(`https://dummyjson.com/comments/post/${postId}?limit=1000`);
//   await fetch(`https://dummyjson.com/comments/post/${postId}`); //adding "/post" in URL endpoint make it to return all comments having given postId.
  if (!response.ok) throw new Error('Failed to load comments');
//   return response.json(); // { returns an object {"comments" : [{"id":1, "body": "Nice!"},{}]"total":2, skip, limit etc.}
   const data = await response.json();
   return data.comments; //now, i get an array of comments. 

}

async function fetchUserById(userId){
  const response = await fetch(`https://dummyjson.com/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user.');
  return response.json(); // 
}

async function makePostCard(post){
    // Only <template> elements have a .content property.
    // .cloneNode(true)
// Make a copy of that element.
// true = deep clone → copy the element and all of its children (e.g., the <h3> and <p> inside).
// false = shallow clone → copy only the outer element, no inner content.
// Duplicate ids inside the template
// If your template contains an element with an id, every clone will have the same id → that’s invalid HTML. Prefer classes or generate unique IDs in JS.
    

    const postTemplate = document.getElementById("post-card-template-container");
    const node = postTemplate.content.firstElementChild.cloneNode(true);

    // Populate the title and body.
    node.querySelector('.post-title').textContent = post.title;
    node.querySelector('.post-body').textContent = post.body;

    // populate the user id.
    const userIdBtn = node.querySelector('.link-user');
    let user = await fetchUserById(post.userId);
    userIdBtn.textContent = `@${user.username}`;
    userIdBtn.dataset.userId = String(post.userId);

    //populate tags from posts tag array.
    const tags = node.querySelector('.tags');
    tags.innerHTML = "";
    (post.tags || []).forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = `tag-class`;
        tagSpan.textContent =`${tag}`;
        tags.appendChild(tagSpan);
    })

    // populate likes and dislikes
    const reactionsElement = node.querySelector('.reactions');
    const reactions = post.reactions;
    reactionsElement.textContent = `👍 ${reactions.likes ?? 0} 👎 ${reactions.dislikes ?? 0}`
    
    // Find the <details> element for comments on this card
const details = node.querySelector('.comments-wrap');

// When the user opens the comments, load them once
 details.addEventListener('toggle', () => {
  if (details.open) {
    const alreadyLoaded = details.dataset.loaded === 'true';
    if (alreadyLoaded) return;
    details.dataset.loaded = 'true';
    // console.log('Opening comments for post', post.id)
    renderCommentCard(details, post.id);  // uses the functions above
  }
});

    // await renderCommentCard(post.id);


    return node;    

}

async function renderCommentCard(container, postId){
    // console.log('renderCommentCard called for', postId);
    
    // const grid = document.querySelector(".comments-wrap[open]")
    // if (!grid) return; 
    // const fragment = document.createDocumentFragment();
    // let child = document.createElement('div');
    try{
      const grid = container;
    const comments = await fetchCommentsForPost(postId);
    // let min = comments.length<3 ? comments.length : 3;
    
    if(comments.length === 0){
      showEmpty(container, "No comments available");
      return;
    }
    // console.log('comments:', comments.length);

    for(let comment of comments){
        // Got the template and clone it.
        const commentTemplate = document.getElementById('comment-item-template');
        const node = commentTemplate.content.firstElementChild.cloneNode(true);

        // Populate the template.
        node.querySelector('.comment-body').textContent = comment.body
        node.querySelector('.comment-user').textContent = `@ ${comment.user.username}`

        // Insert the template

        grid.appendChild(node)

    }

  } catch(err){
    console.error(err);
    showError(container, "Failed to load comments.")
    // console.log('comments:', comments.length);

}}

// Adding card for post in post-container.
async function renderPosts(posts){
    const loadMore = document.querySelector('.load-more')
    for(let post of posts) {
        const card =  await makePostCard(post);
        grid.insertBefore(card, loadMore) //to keep button always in the last row
    }
}



async function loadNextPage(){
    // If we are already loading, stop immediately (avoid double loads).
  if (loading) return; //means if loading = true.
  loading = true;

//   if page has load more button
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Loading…';
  }

  try {
    const data = await fetchAllPosts(limit, skip); // { posts, total, ... }
    total = data.total;               // learn once, keep using
    await renderPosts(data.posts);          // paint the 9 cards
    skip += data.posts.length;        // advance offset

    if (skip >= total) {
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'All posts loaded';
        loadMoreBtn.disabled = true;
      }
    } else {
      if (loadMoreBtn) {
        loadMoreBtn.textContent = 'Load more';
        loadMoreBtn.disabled = false;
      }
    }
  } catch (err) {
    console.error(err);
    if (loadMoreBtn) {
      loadMoreBtn.textContent = 'Retry';
      loadMoreBtn.disabled = false;
    }
    alert('Failed to load posts. Please try again.');
  } finally {
    loading = false;
  }
}


export function initPostsOnce(){
  if (postsInitialized) return;
  postsInitialized = true;

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadNextPage);
  }

  // first 9
  loadNextPage();
}


grid.addEventListener('click', async (e) => {
  const btn = e.target.closest('.link-user');
  if (!btn) return;

  const userId = btn.dataset.userId;
  try {
    const u = await fetchUserById(userId);
    openUserDialog(u);
  } catch {
    alert('Failed to load user.');
  }
});

function openUserDialog(u){
  const dlg = document.getElementById('userDialog');
  dlg.querySelector('#ud-name').textContent =
    `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim();
  dlg.querySelector('#ud-username').textContent = `@${u.username ?? ''}`;
  dlg.querySelector('#ud-email').textContent = u.email ?? '';
  dlg.querySelector('#ud-phone').textContent = u.phone ?? '';
  const addr = [u.address?.address, u.address?.city, u.address?.state].filter(Boolean).join(', ');
  dlg.querySelector('#ud-address').textContent = addr || '';
  dlg.querySelector('#ud-company').textContent =
    [u.company?.name, u.company?.title].filter(Boolean).join(' — ');

  dlg.showModal();
  dlg.querySelector('.close').onclick = () => dlg.close();
  dlg.addEventListener('click', (ev) => { if (ev.target === dlg) dlg.close(); }, { once:true }); // click backdrop to close
}

// To show error messages
function showError(container, message) {
  const errorBox = document.createElement('div');
  errorBox.className = 'error-box';
  errorBox.textContent = message;
  container.appendChild(errorBox);
}

// to show empty state messages
function showEmpty(container, message) {
  const emptyBox = document.createElement('div');
  emptyBox.className = 'empty-box';
  emptyBox.textContent = message;
  container.appendChild(emptyBox);
}
