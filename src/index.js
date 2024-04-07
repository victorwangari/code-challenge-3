// Type your code
// Decraring all variables 
const poster = document.getElementById('poster');
const title = document.getElementById('title');
const runtime= document.getElementById('runtime');
const showtime = document.getElementById('showtime');
const ticket = document.getElementById('buy-ticket');
const description=  document.getElementById ('film-info');
const remainingTickets = document.getElementById('ticket-num');
const filmList = document.getElementById('films');

// Dispalying all the movie requrements.
function displayAllItems(movie){
    const movieTitle = document.getElementById(movie.id)
    movieTitle.addEventListener('click', event => {
        poster.src = movie.poster
        title.textContent = movie.title
        runtime.textContent = `${movie.runtime} Minutes`
        showtime.textContent = movie.showtime
        description.textContent = movie.description
        remainingTickets.textContent = movie.capacity - movie.tickets_sold


        // CONDITIONS FOR DISABLING BUY TICKET BUTTON FOR ALL MOVIES
            if (remainingTickets.textContent == 0) {
               ticket.textContent = "Sold Out";
               ticket.disabled = true;
            } else {
               ticket.textContent = "Buy Ticket";
               ticket.disabled = false;
            }

            purchaseTickets(movie)
            deleteMovie(movie)  
    })
}
// FUNCTION DISPLAY THE FIRST MOVIE 
function firstMovie (first){
    poster.src = first.poster
    title.textContent = first.title
    runtime.textContent = `${first.runtime} Minutes`
    showtime.textContent = first.showtime
    description.textContent = first.description
    remainingTickets.textContent = first.capacity - first.tickets_sold


    // CONDITIONS FOR DISABLING BUY TICKET BUTTON FOR THE FIRST MOVIE 

    if (remainingTickets.textContent == 0) {
               ticket.textContent = "Sold Out";
               ticket.disabled = true;
            } else {
               ticket.textContent = "Buy Ticket";
               ticket.disabled = false;
            }
            purchaseTickets(first)        
}

// FUNCTION LIST ALL MOVIE TITLES ON THE LEFT SIDE
function getTitles (){
    fetch ('http://localhost:3000/films')
    .then(res => res.json())
    .then(movies =>{ movies.forEach(movie => {
        let li = document.createElement('li');
        li.id = movie.id
        li.classList.add("film" ,"item")
        li.innerHTML = `
            ${movie.title}
            <button id="D${movie.id}">Delete</button>
        
        `
        if ((movie.capacity - movie.tickets_sold) === 0) {
            li.classList.add("sold-out")
        }

        filmList.appendChild(li)

        displayAllItems(movie)  
    })
    firstMovie(movies[0])}
    )
}
getTitles()

// FUNCTIONS PURCHASE TICKETS
function purchaseTickets(purchase){
    ticket.onclick = function () {
        if (ticket.textContent === "Buy Ticket") {
            let remTickets = Math.max(0, parseInt(remainingTickets.textContent) - 1);
        
            remainingTickets.textContent = remTickets;
         if(remainingTickets.textContent>=0){
            purchase.tickets_sold++;
            const newTicketSold = {
                tickets_sold : purchase.tickets_sold
    
            }
            console.log(remTickets)

        // UPDATING THE TICKET SOLD 
            fetch(`http://localhost:3000/films/${purchase.id}`, {
                method : 'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(newTicketSold)
            })
            .then(res => res.json())
            .then(data => {
                remainingTickets.textContent = data.capacity - data.tickets_sold

        // CONDITIONS FOR SOLD OUT TICKETS 

                if (remainingTickets.textContent == 0) {
                    ticket.textContent = "Sold Out";
                    document.getElementById(purchase.id).classList.add("sold-out")
                    ticket.disabled = true;
                 } else {
                    ticket.textContent = "Buy Ticket";
                    ticket.disabled = false;
                 }
            } )  
         }
        }
        // POSTING TICKETS BOUGHT
        fetch('http://localhost:3000/tickets',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                film_id: purchase.id,
                tickets: 1
            })
        })       
    }
}
// FUCTIONS DELETE MOVIE 
function deleteMovie(movie){
    const deleteBtn = document.getElementById(`D${movie.id}`)
    deleteBtn.addEventListener('click',()=>{
        fetch(`http://localhost:3000/films/${movie.id}`,{
            method :'DELETE',
            headers:{
                'Content-Type': 'application/json'
            }
        })

        console.log(movie.title)
    })
}


