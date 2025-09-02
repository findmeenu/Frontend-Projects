export function showPage(id){
    // get all buttons and pages
    const button = document.querySelectorAll(".nav-button")
    const pages = document.querySelectorAll('.page');

    // 1) hide everything
    pages.forEach(sec => sec.classList.add('hidden'));

    // 2) show the one user wants
    const target = document.getElementById(id);
    if (target){
        target.classList.remove('hidden')
    }

    // Loop through all buttons and choose the button data target matching id
    // &highlight the active button
    button.forEach(btn => {
        // isActive stores boolean based on condition. 
        const isActive = btn.dataset.target === id;
        // Adds or remove the class based on true or false respectively.
        btn.classList.toggle('active', isActive);
    })
}   