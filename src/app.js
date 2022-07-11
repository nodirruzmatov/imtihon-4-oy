"use strict";

const getData = async () => {
  const request = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=python`
  );

  const data = await request.json();

  console.log(data);
};

getData();
