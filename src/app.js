"use strict";

const elBooksList = document.querySelector(".books__list");
const elSearchInput = document.querySelector(".header__search");
const elBookmarkList = document.querySelector(".bookmar-list");
const elResultNum = document.querySelector(".result__desc");
const elAllPages = document.querySelector(".books__allPages");
const elOrderBtn = document.querySelector(".orderBtn");
const elModal = document.querySelector(".modal");
const elModalBofy = document.querySelector(".modal__body");
const elModalClose = document.querySelector(".modal__close");
const elModalBg = document.querySelector(".modal-bg");

let srcValue = "javascript";

const localData = JSON.parse(window.localStorage.getItem("marked"));

const bookmarkArr = localData || [];
let order = "relevance";

let pages;

// ! ORDER BTN
elOrderBtn.addEventListener("click", (ent) => {
  if (order === "newest") {
    order = "relevance";

    elOrderBtn.textContent = "Order by newest";

    elBooksList.innerHTML = null;

    getData();
  } else if (order === "relevance") {
    order = "newest";

    elOrderBtn.textContent = "Order by relevance";

    elBooksList.innerHTML = null;

    getData();
  }
});

// ! get input value for request
elSearchInput.addEventListener("change", (ent) => {
  ent.preventDefault();

  srcValue = elSearchInput.value;

  elSearchInput.value = "";
  elBooksList.innerHTML = null;
  getData();
});

// ! get data from backend
const getData = async () => {
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${srcValue}&orderBy=${order}&startIndex=0`
  );

  const data = await request.json();

  console.log(data.items);

  render(data.items, elBooksList);
  renderBookmark(bookmarkArr, elBookmarkList);

  elResultNum.textContent = `Showing ${data.totalItems} Result(s)`;

  pages = Math.ceil(data.totalItems / 10);
  // addPages(pages, elAllPages);
};

getData();

// ! render books
const render = (arr, elHtml) => {
  arr.forEach((book) => {
    const html = `
    <li class="books__item flex flex-col justify-between max-w-[282px] pl-[18px] py-[13px] pr-[15px] rounded-[5px] bg-[#fff]">

      <div class="item-img grow-0 py-[18px] px-[24px] rounded-[5px] bg-[#f8fafd]">
        <img class="rounded-[5px]" src="${book.volumeInfo.imageLinks.smallThumbnail}" width="201" hieght="202">
      </div>

      <div>
        <h3 class="item-title mt-[19px] text-[18px] leadind-[21px] font-medium">${book.volumeInfo.title}</h3>
        <p class="item-owner text-[13px] leadind-[21px] font-medium text-[#757881]">${book.volumeInfo.authors}</p>
        <p class="item-year pb-[10px] text-[13px] leadind-[21px] font-medium text-[#757881]">${book.volumeInfo.publishedDate}</p>
      </div>

      <div class="books__btn grid grid-cols-2 grid-rows-2 gap-[5px]">
        <button data-mark="${book.id}"
          class="books-bookmark py-[10px] px-[26px] rounded-[4px] bg-[#FFD80D] text-[14px] leading-[17px] font-medium">Bookmark</button>

        <button data-info="${book.id}"
          class="books-moreInfo py-[10px] px-[26px] rounded-[4px] bg-[#f3f8ff] text-[14px] leading-[17px] font-medium text-[#3f75ff]">More
          Info</button>
          
        <a href="${book.volumeInfo.previewLink}" target="_blanck"
          class="books-read text-center pt-[9px] col-span-2 rounded-[4px] bg-[#75828A] text-[14px] leading-[17px] font-medium text-[#fff]">Read</a>
      </div>

    </li>
    `;

    elHtml.insertAdjacentHTML("beforeend", html);
  });
};

// !bookmark*
const renderBookmark = (local, elHtml) => {
  elBookmarkList.innerHTML = null;

  local.forEach((book) => {
    const html = `
      <li class="bookmark-item mb-[15px] px-[10px] py-[15px] flex justify-between rounded-[4px] bg-[#f8fafd]">
    
        <div class="bookmark-text max-w-[170px] w-full">
          <h3 class="bookmark-title text-[16px] leading-[19px] font-medium">${book.volumeInfo.title}</h3>
          <p class="bookmark-owner text-[13px] leading-[18px] font-normal text-[#757881]">${book.volumeInfo.authors}</p>
        </div>
    
        <div class="bookmark-btn flex items-center">
          <a class="bookmark-read mr-[5px]" href="${book.volumeInfo.previewLink}" target="_blanck">
            <img src="../images/read-icon.png" width="24" height="24" alt="reading icon">
          </a>
          <button class="bookmark-remove" data-remove="${book.id}">
            <img class="bookmark-remove" data-remove="${book.id}" src="../images/remove-icon.png" width="24" height="24" alt="reading icon">
          </button>
        </div>
      </li>
    `;

    elHtml.insertAdjacentHTML("beforeend", html);
  });
};

elBooksList.addEventListener("click", async (ent) => {
  if (ent.target.matches(".books-bookmark")) {
    const request = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${srcValue}`
    );

    const data = await request.json();

    const bookMark = ent.target.dataset.mark;

    data.items.forEach((book) => {
      if (book.id === bookMark) {
        if (!bookmarkArr.some((reading) => reading.id === bookMark)) {
          bookmarkArr.push(book);

          renderBookmark(bookmarkArr, elBookmarkList);
          window.localStorage.setItem("marked", JSON.stringify(bookmarkArr));
        }
      }
    });
  }
});

elBookmarkList.addEventListener("click", (ent) => {
  if (ent.target.matches(".bookmark-remove")) {
    const removeBtn = ent.target.dataset.remove;

    bookmarkArr.splice(
      bookmarkArr.findIndex((remove) => remove.id === removeBtn),
      1
    );

    renderBookmark(bookmarkArr, elBookmarkList);
    window.localStorage.setItem("marked", JSON.stringify(bookmarkArr));
  }
});

// ! Modal----------------------------------------------------
elBooksList.addEventListener("click", async (ent) => {
  if (ent.target.matches(".books-moreInfo")) {
    elModal.classList.remove("hidden");

    elModalBofy.innerHTML = null;

    const request = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${srcValue}`
    );

    const data = await request.json();

    const infoBtn = ent.target.dataset.info;
    console.log(infoBtn);

    const modalData = data.items.find((book) => book.id === infoBtn);
    console.log(data.items);

    const html = `
      <div class="modal__top flex justify-between items-center max-w-[5520px] w-full pt-5 px-5 bg-[#F8FAFD]">
        <h2 class="modal_heading text-[24px] leading-[28px] font-[500] text-[#222531]">${modalData.volumeInfo.title}</h2>
  
        <button class="modal__close w-[14px] h-[14px] text-[#58667E] text-[24px] font-[300]">X</button>
      </div>
  
      <div class="modal__middle mt-11 px-5 bg-white">
  
        <img src="${modalData.volumeInfo.imageLinks.smallThumbnail}" width="229" height="300" alt="book">
  
        <p class="modal__desc mt-11 mb-[51px] text-[14px] leading-[170%] font-[400] text-[#58667E]">${modalData.volumeInfo.description}
        </p>
  
        <div>
          <p class="pb-[21px] text-[#222531] font-[400] text-[14px] leading-[17px]">Author :<span class="modal-author ml-[17px] py-[6px] px-[21px] rounded-[30px] font-[400] text-[14px] leading-[17px] text-[#0D75FF] bg-[#e9f3ff]">${modalData.volumeInfo.authors[0]}</span></p>
  
  
          <p class="pb-[21px] text-[#222531] font-[400] text-[14px] leading-[17px]">Published : <span class="modal-published ml-[17px] py-[6px] px-[21px] rounded-[30px] font-[400] text-[14px] leading-[17px] text-[#0D75FF] bg-[#e9f3ff]">${modalData.volumeInfo.publisheDate}</span>
          </p>
  
          <p class="pb-[21px] text-[#222531] font-[400] text-[14px] leading-[17px]">Publishers:<span class="modal-publisher ml-[17px] py-[6px] px-[21px] rounded-[30px] font-[400] text-[14px] leading-[17px] text-[#0D75FF] bg-[#e9f3ff]">${modalData.volumeInfo.publisher}</span>
          </p>
  
          <p class="pb-[21px] text-[#222531] font-[400] text-[14px] leading-[17px]">Categories :<span
              class="ml-[17px] py-[6px] px-[21px] rounded-[30px] font-[400] text-[14px] leading-[17px] text-[#0D75FF] bg-[#e9f3ff]">${modalData.volumeInfo.categories[0]}</span>
          </p>
  
          <p class="pb-[21px] text-[#222531] font-[400] text-[14px] leading-[17px]">Pages Count:<span
              class="ml-[17px] py-[6px] px-[21px] rounded-[30px] font-[400] text-[14px] leading-[17px] text-[#0D75FF] bg-[#e9f3ff]">${modalData.volumeInfo.pageCount}</span>
          </p>
        </div>
  
      </div>
  
      <div class="modal__bottom flex justify-end max-w-[5520px] w-full px-5 py-4 bg-[#F8FAFD]">
        <a href="${modalData.volumeInfo.previewLink}" target="_blank"
          class="py-[9px] px-[38px] rounded-[4px] text-[14px] leading-[17px] font-[500] text-white bg-[#75828A]">Read</a>
      </div>
  
    `;

    elModalBofy.insertAdjacentHTML("beforeend", html);
  }
});

elModal.addEventListener("click", (ent) => {
  if (ent.target.matches(".modal__close")) {
    elModal.classList.add("hidden");
  }
});

elModalBg.addEventListener("click", () => {
  elModal.classList.add("hidden");
});

// !pages

const addPages = (page, elhtml) => {
  for (let i = 1; i <= page; i++) {
    const html = `
      <button class=" mr-2 p-[4px] bg-white w-[32px] h-[32px] border border-[#DFE3E8] rounded-[4px] text-[14px] leading-[20px] font-[700]">${i}</button>
    `;

    elhtml.insertAdjacentHTML("beforeend", html);
  }
};

elAllPages;
