import api from './api.js';
import { hide, show } from './global.js';

const { getBeerById, createComment } = api();

const detailTemplate = (beer) => {
  return `
    <div class="beer-detail">
        <h1 class="title">${beer.name}</h1>

        <div class="image">
            <img src="${beer.image}" alt="${beer.name}"/>
        </div>

        <div class="data">
            <h3>Beer Data</h3>
            <ul>
                <li>Price: ${beer.price}$</li>
                <li>First Brewed: ${beer.firstBrewed}</li>
                <li>Contribute: ${beer.contributedBy}</li>
            </ul>
        </div>
        <div class="tips">
            <h3>Brewer's Tips</h3>
            <p>${beer.brewersTips}</p>
        </div>
        <div class="description">
        <h3>Description</h3>
            <p>${beer.description}</p>
        </div>
    </div>
   `;
};

const commentTemplate = (comment) => {
  return `
   <div class="comment">
        <div class="text">${comment.comment}</div>  
        <div class="date"><h5>${comment.dateComment.slice(0, 10)} - ${comment.dateComment.slice(
    11,
    16
  )}<h5></div>
        
    </div>
   `;
};

const printBeer = (beer) => {
  const sectionContainer = document.getElementById('main-section');
  sectionContainer.classList.remove('section-container');
  sectionContainer.classList.add('section-detail');
  const beerHTML = detailTemplate(beer);
  sectionContainer.innerHTML = beerHTML;
};

const printComments = (comments) => {
  const commentList = document.getElementById('comment-list');
  commentList.innerHTML = '';
  comments.forEach((comment) => {
    const commentHTML = commentTemplate(comment);
    commentList.innerHTML += commentHTML;
  });
};

const beerDetails = async (id) => {
  const beer = await getBeerById(id);
  printBeer(beer);
  printComments(beer.comments);
  hide(document.querySelector('.date-filter'));
  hide(document.querySelector('.search-filter'));
  hide(document.querySelector('#reset-forms'));
  show(document.querySelector('#back-button'));
  show(document.querySelector('.comment-section'));
  document.querySelector('.comment-form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    postComment(id);
  });
};

const postComment = async (id) => {
  const comment = document.querySelector('#comment');
  if (comment.validity.valid) {
    await createComment(id, comment.value);
    await getBeerById(id).then((beer) => {
      const newComments = beer.comments;
      printComments(newComments);
    });

    comment.value = '';
  }
};

const backButton = document.querySelector('#back-button');
backButton.addEventListener('click', () => {
  location.href = '/';
});

export default beerDetails;
