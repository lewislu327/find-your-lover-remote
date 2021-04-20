const base_url = "https://lighthouse-user-api.herokuapp.com/";
const index_url = base_url + "api/v1/users/";
const users = JSON.parse(localStorage.getItem('favoriteUsers'))
const users_per_page = 12
const dataPanel = document.querySelector("#data-panel");
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
let filteredNames = []

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card col-md-3" style="width: 18rem;">
      <h3 class="text-end mr-2 mt-2 mb-0 text-danger" >
      <i class="fas fa-heart" id="btn-remove-favorite" data-id="${item.id}"></i></h3>
			<img src="${item.avatar}" class="avatar mt-2 rounded-circle" data-id=${item.id}  alt="..." data-bs-toggle="modal" data-bs-target="#user-Modal" >
			<div class="card-body">
			<h5 class="user-name text-center"><em>${item.name} ${item.surname}</em></h5>
			</div>
		</div>`;
    dataPanel.innerHTML = rawHTML;
  });
}

renderUserList(getUsersByPage(1))
renderPaginator(users.length)

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".avatar")) {
    console.log(event.target.dataset.id);
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('#btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
    event.target.classList.remove("fas",'fa-heart' )
    event.target.classList.add("far",'fa-heart' )
    window.location.reload()
  }
})

function showUserModal(id) {
  const modalName = document.querySelector("#user-modal-name");
  const modalImage = document.querySelector("#user-modal-image");
  const modalRegion = document.querySelector("#user-modal-region");
  const modalEmail = document.querySelector("#user-modal-email");
  const modalGender = document.querySelector("#user-modal-gender");
  const modalAge = document.querySelector("#user-modal-age");
  const modalBirthday = document.querySelector("#user-modal-birthday");

  axios.get(index_url + id).then((response) => {
    const data = response.data;
    modalName.innerHTML = `Name: ${data.name}  ${data.surname}`;
    modalImage.innerHTML = ` <img src="${data.avatar}" class="rounded-circle" alt="user-avatar" style="width: 12rem">`;
    modalRegion.innerText = "Region: " + data.region;
    modalEmail.innerText = "Email:  " + data.email;
    modalGender.innerText = "Gender:  " + data.gender;
    modalAge.innerText = "Age:  " + data.age;
    modalBirthday.innerText = "Birthday:  " + data.birthday;
  });
}


function removeFromFavorite(id) {
  if(!users) return

  //透過 id 找到要刪除電影的 index
  const userIndex = users.findIndex((user) => user.id === id)
  console.log(userIndex)
  if(userIndex === -1) return

  //刪除該筆電影
  users.splice(userIndex,1)

  //存回 local storage
  localStorage.setItem('favoriteUsers', JSON.stringify(users))

  //更新頁面
  renderUserList(users)
}

function getUsersByPage(page) {
// page 1 -> movies 0 - 11
// page 2 -> movies 12 - 23
// page 3 -> movies 24 - 35
// ...
  const startIndex = (page - 1) * users_per_page
  const data = filteredNames.length ? filteredNames : users
  return data.slice(startIndex, startIndex + users_per_page)
}


paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
})

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / users_per_page)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}" style="background-color:#fafafa">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}




