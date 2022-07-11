"use strict";

const elBooksList = document.querySelector(".books__list");
const elSearchInput = document.querySelector(".header__search");

let srcValue = "javascript";

const bookmarkArr = [];

JSON.parse(window.localStorage.getItem("mared")) ||
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
    `https://www.googleapis.com/books/v1/volumes?q=${srcValue}`
  );

  const data = await request.json();

  console.log(data.items[0]);

  render(data.items, elBooksList);
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
        <button
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

// !bookmark
// const renderBookmark = (local, elHtml) => {
//   const html = `
//   <li class="bookmark-item mb-[15px] px-[10px] py-[15px] flex justify-between rounded-[4px] bg-[#f8fafd]">

//     <div class="bookmark-text">
//       <h3 class="bookmark-title text-[16px] leading-[19px] font-medium">Python</h3>
//       <p class="bookmark-owner text-[13px] leading-[18px] font-normal text-[#757881]">David M. Beazley</p>
//     </div>

//     <div class="bookmark-btn flex">
//       <button class="bookmark-read mr-[5px]">
//         <img src="../images/read-icon.png" width="24" height="24" alt="reading icon">
//       </button>
//       <button class="bookmark-remove">
//         <img src="../images/remove-icon.png" width="24" height="24" alt="reading icon">
//       </button>
//     </div>
//   </li>
//   `;
// };

// elBooksList.addEventListener("click", async (ent) => {
//   const request = await fetch(
//     `https://www.googleapis.com/books/v1/volumes?q=${srcValue}`
//   );

//   const data = await request.json();

//   const bookMark = ent.target.dataset.mark;

//   data.items.forEach((book) => {
//     if (book.id === bookMark) {
//       if (!bookmarkArr.includes(book.volumeInfo)) {
//         console.log(!bookmarkArr.includes(book));
//         bookmarkArr.push(book);
//         console.log(bookmarkArr);
//       }
//     }
//   });
// });
