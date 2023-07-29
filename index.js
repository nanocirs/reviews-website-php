let stars_count = 0;
let isScoreLocked = false;
let reviews_quantity = 0;
let visits_number = 0;
const results_per_page = 20;

let review_list = [];

window.addEventListener('load', onPageLoaded);

function onPageLoaded() {
    getReviews();
}

function setupReviewPanel() {

    const stars = document.querySelectorAll('.star');
    const star_off = '&#9734;';
    const star_on = '&#9733;';

    document.getElementById('submit_button').addEventListener('click', submitReview);

    document.getElementById('stars').addEventListener('mouseleave', () => {

        for (let i = 0; i < stars.length; i++) {

            if (!isScoreLocked) {

                stars[i].classList.remove('starselected');
                stars[i].innerHTML = star_off;
            }
        }

    })

    for (let i = 0; i < stars.length; i++) {

        stars[i].addEventListener('click', () => {

            for (let j = 1; j < stars.length; j++) {
                    
                    stars[j].classList.remove('starselected');
                    stars[j].innerHTML = star_off;
                    
                }
                
            for (let j = 0; j <= i; j++) {
                    
                stars[j].classList.add('starselected');
                stars[j].innerHTML = star_on;
                
            }

            isScoreLocked = true;

        });

        stars[i].addEventListener('mouseover', () => {

            if (!isScoreLocked) {

                for (let j = 1; j < stars.length; j++) {
                    
                    stars[j].classList.remove('starselected');
                    stars[j].innerHTML = star_off;
                    
                }
                
                for (let j = 0; j <= i; j++) {
                    
                    stars[j].classList.add('starselected');
                    stars[j].innerHTML = star_on;
                
                }
            }

        });
    }

    const textarea = document.getElementById("review_text");

    textarea.addEventListener("wheel", function(e) {
        e.preventDefault();
        textarea.scrollTop += e.deltaY;
    });

    textarea.addEventListener("touchstart", function(event) {
        setTimeout(function() {
            textarea.focus();
        }, 500);
    });

}

function getReviews() {

    const data = new FormData();
    data.append('request', true);

    fetch('get_reviews.php', {
        method: 'POST',            
        body: data
    })
    .then(response => response.json())
    .then(datos => {

        reviews_quantity = datos.length;

        for (let i = 0; i < reviews_quantity; i++) {

            review_list[i] = {
                user : datos[i]['user'],
                text: datos[i]['review'],
                date: datos[i]['date'],
                rating: datos[i]['rating']
            }
        }

        showReviews(1);

    })
    .catch(error => console.error(error));

}

function showReviews(page) {

    const reviews_container_left = document.getElementById('reviews_container_l');
    const reviews_container_right = document.getElementById('reviews_container_r');

    const review_panel = `
    <div class="review">
        <div class="rating">
            <label>Your Rating &nbsp;</label>
            <label id="stars">
                <span class="star user_rating">&#9734;</span>                        
                <span class="star user_rating">&#9734;</span>                        
                <span class="star user_rating">&#9734;</span>                       
                <span class="star user_rating">&#9734;</span>             
                <span class="star user_rating">&#9734;</span>
            </label>
        </div>
        <label>Share your thoughts:</label>
        <textarea autofocus class="review_area" maxlength="500" id="review_text" name="comment" autocomplete="off"></textarea><br>
        <label>Provide a username&nbsp</label>
        <input autofocus type="text" maxlength="16" id="input_name" autocomplete="off">
        <input type="submit" class="btn" id="submit_button" value="Submit">
        <br>
        <p id="review_warning" class="error"></p>
    </div>`;

    reviews_container_left.innerHTML = review_panel;
    reviews_container_right.innerHTML = '';

    setupReviewPanel();

    if (reviews_quantity == 0) {   

        generatePagination(0);
        return;            

    }

    const lastPage = Math.ceil(reviews_quantity/results_per_page);

    if (lastPage == 0 || page == -1) {
        
        page = lastPage;

    }

    const current_page = page;

    const pagination_div = document.getElementById('pagebar');

    if (pagination_div.style.display === 'none') {
        
        if (lastPage > 1){
            
            pagination_div.style.display = 'block';

        }

    }

    for (let i = (current_page - 1) * results_per_page; i < results_per_page * current_page && i < reviews_quantity; i++) {

        const date_parts = review_list[i].date.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
        const date_js = new Date(date_parts[1], date_parts[2] - 1, date_parts[3], date_parts[4], date_parts[5], date_parts[6]);

        const review_user   = review_list[i].user;
        const review_rating = review_list[i].rating;
        const review_text   = review_list[i].text;

        const review_date   = date_js.toLocaleDateString('en-US');
        const review_time   = date_js.toLocaleTimeString('es-ES');
        
        let stars_html = '';
        
        for (let j = 0; j < review_rating; j++) {
            
            stars_html += '<a class="starselected">&#9733;</a>';
            
        }
        
        for (let j = review_rating; j < 5; j++) {
            
            stars_html += '<a>&#9734;</a>';
            
        }
        
        const review = document.createElement('div');
        review.innerHTML = '<a class="review_username">' + review_user + '</a> gave ' + stars_html;
        review.innerHTML += '<br>';
        review.innerHTML += '<p>' + review_text + '</p>';
        review.innerHTML += '<p class="info">Posted on ' + review_date + ' at ' + review_time + '</p>';
        review.classList.add('review');
        
        const left_container_children = reviews_container_left.querySelectorAll('div');
        const right_container_children = reviews_container_right.querySelectorAll('div');

        let left_container_height = 0;
        let right_container_height = 0;

        for (let j = 0; j < left_container_children.length; j++) {

            left_container_height += left_container_children[j].offsetHeight;

        }

        for (let j = 0; j < right_container_children.length; j++) {

            right_container_height += right_container_children[j].offsetHeight;

        }

        if (left_container_height > right_container_height && window.innerWidth > 1500) {

            reviews_container_right.appendChild(review);

        }
        else {

            reviews_container_left.appendChild(review);

        }

    }

    generatePagination(page);

}

function submitReview() {

    const user_name   = document.getElementById('input_name').value;
    const review_text = document.getElementById('review_text').value;
    const stars_count = document.querySelectorAll('.starselected.user_rating').length;

    document.getElementById('review_warning').innerHTML = '';

    if (stars_count < 1) {

        document.getElementById('review_warning').innerHTML = 'You must atleast provide one star.';

        return;

    }

    if (user_name.length < 4) {

        document.getElementById('review_warning').innerHTML = 'Your username must be atleast 4 characters long.';

        return;

    }

    if (review_text.length < 1) {

        document.getElementById('review_warning').innerHTML = 'Write a review.';

        return;

    }

    const data = new FormData();
        data.append('username', user_name);
        data.append('review', review_text);
        data.append('rating', stars_count);

    fetch('send_review.php', {
        method: 'POST',            
        body: data
    })
    .then(response => response.text())
    .then(data => {
        if (data == 'already_reviewed') {

            document.getElementById('review_warning').innerHTML = 'You can only post a review every 2 hours.';

        }
    })
    .then(getReviews());
    
}

function generatePagination(page) {

    const pageBar = document.getElementsByClassName('pagination');
    
    if (page == 0) {

        pageBar[0].innerHTML = '';
        return;

    }

    const lastPage = Math.ceil(reviews_quantity/results_per_page);

    let htmlPag = '';

    if (page == -1) {

        page = lastPage;

    }

    let i = page - 5;
    let fi = 1;
    
    if (i < 1) {

        i = 1;

    }

    while(i < page) {

        htmlPag += '<a href="javascript:showReviews(' + i + ');">' + i + '</a>';
        i++; fi++;

    }

    htmlPag += '<a class="active">' + i + '</a>';
    i++; fi++;

    while(i < lastPage && (i < page + 6 || fi < 12)) {

        htmlPag += '<a href="javascript:showReviews(' + i + ');">' + i + '</a>';
        i++; fi++;

    }

    if (page + 6 < lastPage){

        htmlPag += '<a id="nohover">...</a>';

    }

    if (page != lastPage){

        htmlPag += '<a href="javascript:showReviews(-1);">' + lastPage + '</a>';
        fi++;

    }
    
    while(fi < 12 && fi < lastPage) {

        htmlPag = '<a href="javascript:showReviews(' + (lastPage + 1- fi) + ');">' + (lastPage + 1 - fi) + '</a>' + htmlPag;
        fi++;

    }
    
    htmlPag = '<a href="javascript:showReviews(1);">&laquo;</a>' + htmlPag;
    htmlPag += '<a href="javascript:showReviews(-1);">&raquo;</a>';


    
    if (window.innerWidth < window.innerHeight) {

        htmlPag = '';

        if (page - 1 > 0) {
            
            htmlPag += '<a class="btn" href="javascript:showReviews(' + (page - 1) + ');">Prev</a>';

        }

        if (page + 1 < lastPage + 1) {
            htmlPag += '<a class="btn" href="javascript:showReviews(' + (page + 1) + ');">Next</a>';
        
        }

    }

    pageBar[0].innerHTML = htmlPag;

}