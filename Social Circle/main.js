import { showPage } from './display.js';
import { formSubmission } from './contact.js';
import { initPostsOnce  } from './post.js';

document.addEventListener('DOMContentLoaded', function(){
    const buttons = document.querySelectorAll('.nav-button');

    // show Home by default
    showPage('home')   ;
   
    //Loads validation and event listner for form submission
    formSubmission();

    // Add event listner to navigation buttons
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.target; 
    console.log(id)
    showPage(id);
       
    if (id === 'posts') {
        initPostsOnce();  // <-- load first 9 and wire button
      }
  });
});


});
