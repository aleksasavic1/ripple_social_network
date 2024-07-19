let session = new Session();
let session_id = session.getSession();

if(session_id !== "") {


    async function populateUserData() {
        let user = new User();
        user = await user.get(session_id);

        document.querySelector("#username").innerText = user['username'];
        document.querySelector("#email").innerText = user['email'];

        document.querySelector("#edit_username").value = user['username'];
        document.querySelector("#edit_email").value = user['email'];
    }

    populateUserData()
    
} else {
    window.location.href = "/";
}


document.querySelector("#logout").addEventListener('click', e => {
    e.preventDefault();

    session.destroySession();
    window.location.href = '/';
});


let modal = document.querySelector("#editAccount");
modal.addEventListener("click", () => {
    document.querySelector('.editAcc-modal').style.display = "block";
});
let closeModal = document.querySelector("#closeModal");
closeModal.addEventListener("click", () => {
    document.querySelector('.editAcc-modal').style.display = "none";
});


document.querySelector("#editForm").addEventListener('submit', e => {
    e.preventDefault();

    let user = new User();

    user.username = document.querySelector("#edit_username").value;
    user.email = document.querySelector("#edit_email").value;

    user.edit();
});


document.querySelector("#deleteProfile").addEventListener("click", e => {
    e.preventDefault();

    let text = "Are you sure you want to permanently delete your profile?";

    if(confirm(text) === true) {
        let user = new User();
        user.delete();
    }
});

document.querySelector("#postForm").addEventListener("submit", e => {
    e.preventDefault();

    async function createPost() {
        let content = document.querySelector("#postContent").value;
        document.querySelector("#postContent").value = "";
        let post = new Post();
        post.post_content = content;
        post = await post.create();

        let current_user = new User();
        current_user = await current_user.get(session_id);

        let html = document.querySelector("#allPosts").innerHTML;

        let delete_post = '';
        if(session_id === post.user_id) {
            delete_post = `<button class="remove-btn" onclick="removePost(this)">Remove</button>`;
        }

        document.querySelector("#allPosts").innerHTML = `<div class="single-post" data-post_id="${post.id}">
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <p><b>Author:</b> ${current_user.username}</p>
                <div>
                    <button onclick="likePost(this)" class="likePost like-btn"><span>${post.likes}</span> Likes</button>
                    ${delete_post}
                </div>
            </div>                                              
        </div>` + html;
    }

    createPost();
});


async function getAllPosts() {
    let all_posts = new Post();
    all_posts = await all_posts.getAllPosts();


    all_posts.forEach(post => {
        async function getPostUser() {
            let user = new User();
            user = await user.get(post.user_id);

            let html = document.querySelector("#allPosts").innerHTML;

            let delete_post = '';
            if(session_id === post.user_id) {
                delete_post = `<button class="remove-btn" onclick="removePost(this)">Remove</button>`;
            }

            document.querySelector("#allPosts").innerHTML = `<div class="single-post" data-post_id="${post.id}">
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <p><b>Author:</b> ${user.username}</p>
                <div>
                    <button onclick="likePost(this)" class="likePost like-btn"><span>${post.likes}</span> Likes</button>
                    ${delete_post}
                </div>
            </div>                                              
        </div>` + html;
        

        }

        getPostUser();
    });
}

getAllPosts();

const removePost = btn => {
    let post_id = btn.closest(".single-post").getAttribute("data-post_id");

    btn.closest(".single-post").remove();

    let post = new Post();
    post.delete(post_id);
}

const likePost = btn => {
    let main_post_element = btn.closest(".single-post");
    let post_id = btn.closest(".single-post").getAttribute("data-post_id");
    let number_of_likes = parseInt(btn.querySelector("span").innerText);

    btn.querySelector("span").innerText = number_of_likes + 1;
    btn.setAttribute("disabled", "true");

    let post = new Post();
    post.like(post_id, number_of_likes + 1);
}