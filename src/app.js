"use strict";

const elBooksList = document.querySelector(".books__list");

const getData = async () => {
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=python`
  );

  const data = await request.json();

  console.log(data.items[0].volumeInfo);

  render(data.items, elBooksList);
};

getData();

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
        <button
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
