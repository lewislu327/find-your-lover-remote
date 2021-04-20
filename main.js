const BASE_URL = "https://lighthouse-user-api.herokuapp.com/";
const INDEX_URL = BASE_URL + "api/v1/users/";
const users = [];
const users_per_page = 12
const dataPanel = document.querySelector("#data-panel");
const searchInput = document.querySelector('#search-input')
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')
const girlBtn = document.querySelector("#female")
const boyBtn = document.querySelector("#male")
const allBtn = document.querySelector("#all")

let filteredNames = []

function renderUserList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <div class="card col-md-3" style="width:18rem">
    <h3 class="text-end mr-2 mt-2 mb-0 text-danger" >
    <i class="far fa-heart" id="btn-add-favorite" data-id="${item.id}"></i></h3>
			<img src="${item.avatar}" class="avatar mt-2 rounded-circle" style="height:13rem" data-id=${item.id}  alt="..." data-bs-toggle="modal" data-bs-target="#user-Modal">
			<div class="card-body" >
			<h5 class="user-name text-center"><em>${item.name} ${item.surname}</em></h5>
			</div>
    </div>   
	`;
    dataPanel.innerHTML = rawHTML;
  });
}

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results);
  renderUserList(getUsersByPage(1));
  renderPaginator(users.length)
  onlyGirl = users.filter( user => user.gender === "female")
  onlyBoy = users.filter( user => user.gender === "male")
});

dataPanel.addEventListener("click", function onPanelClicked(event) {
  
  if (event.target.matches(".avatar")) {
    console.log(event.target.dataset.id);
    showUserModal(Number(event.target.dataset.id));
  } else if (event.target.matches('#btn-add-favorite')) {
    console.log(event.target)
    addToFavorite(Number(event.target.dataset.id));
    event.target.classList.remove("far",'fa-heart' )
    event.target.classList.add("fas",'fa-heart' )

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

  axios.get(INDEX_URL + id).then((response) => {
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

searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
	event.preventDefault();
	console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase()
  
  if (keyword.length === 0 ) return
	
  filteredNames = users.filter( user => user.name.toLowerCase().includes(keyword))
  if (filteredNames.length === 0){
    return alert('we cannot find this user: ' + keyword)
  }
  
  renderPaginator(filteredNames.length)
  renderUserList(filteredNames)
})

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  const user = users.find((user) => user.id === id)
  if (list.some((user) => user.id === id)) {
    return alert('it is already in your favorite！')
  }
  list.push(user)
  localStorage.setItem('favoriteUsers', JSON.stringify(list))
}

function getUsersByPage(page) {
  const startIndex = (page - 1) * users_per_page
  const data = filteredNames.length ? filteredNames : users
  return data.slice(startIndex, startIndex + users_per_page)
}
function slicePeople(page, arr) {
  const startIndex = (page - 1) * users_per_page
  return arr.slice(startIndex,startIndex + users_per_page)
}


paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderUserList(getUsersByPage(page))
  if (Number(event.target.dataset.id) === 1) {
    renderUserList(slicePeople(page,users))
  } else if (Number(event.target.dataset.id) === 2) {
    renderUserList(slicePeople(page,onlyGirl))
  } else if (Number(event.target.dataset.id) === 3) {
    renderUserList(slicePeople(page,onlyBoy))
  }
})

function renderPaginator(amount, id) {
  const numberOfPages = Math.ceil(amount / users_per_page)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}" data-id="${id}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// Female監聽器
girlBtn.addEventListener("click",function(){
  const onlyGirl = users.filter( user => user.gender === "female")
  renderPaginator(onlyGirl.length,2)
  renderUserList(slicePeople(1,onlyGirl))
})

// Male監聽器
boyBtn.addEventListener("click",function(){
  const onlyBoy = users.filter( user => user.gender === "male")
  renderPaginator(onlyBoy.length,3)
  renderUserList(slicePeople(1,onlyBoy))
})

// All 監聽器
allBtn.addEventListener("click",function(){
  renderUserList(slicePeople(1,users))
  renderPaginator(users.length,1)
})
