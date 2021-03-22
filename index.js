/************************** EVENTS JS MINI CHALLENGE WITH JSON SERVER ******************************/

/************************ deliverable 1 ****************/
// When the page loads, the information about the traveler should display including their name, image, nickname, and number of likes

/************************ traveler elements ****************/
const travelerContainer = document.querySelector('div.traveler')
const travImg = travelerContainer.querySelector('img')
const travName = travelerContainer.querySelector('h2')
const travNickName = travName.nextElementSibling
const travLikes = travNickName.nextElementSibling
/************************ aniaml sighting elements ****************/
const animalSightingsContainer = document.querySelector('ul#animals')
// const sightingLikeButton = animalSightingsContainer.querySelector('button.likes')
// const sightingDeleteButton = animalSightingsContainer.querySelector('button.delete')
// const sightingToggleButton = animalSightingsContainer.querySelector('button.toggle')



/************************ DOM LOAD ********************************/

document.addEventListener('DOMContentLoaded', () => {
    renderTravelerOne()
    renderAnimalSightings()
})


/********************* render traveler one ***************************/
const renderTravelerOne = () => {
    fetch('http://localhost:3000/travelers/1')
    .then(res => res.json())
    .then(travOne => renderTraveler(travOne))
}
// "id": 1,
//   "name": "Raffy",
//   "nickname": "Rafferty",
//   "photo": "pics/raffy.jpg",
//   "likes": 1028,

/********************* render one traveler ***************************/
const renderTraveler = (traveler) => {
    travelerContainer.id = traveler.id
    travImg.src = traveler.photo
    travName.textContent = traveler.name
    travNickName.textContent = traveler.nickname
    travLikes.textContent = `${traveler.likes} Likes`
}

// {
//     "id": 1,
//     "travelerId": 1,
//     "species": "frog",
//     "photo": "pics/frog.jpg",
//     "link": "https://youtu.be/Fa_I68L_APY",
//     "description": "I saw this beautiful green frog resting on a leaf!",
//     "likes": 0
//   }

/********************* render all sightings ***************************/

const renderAnimalSightings = () => {
    fetch('http://localhost:3000/animalsightings')
    .then(res => res.json())
    .then(sightings => {

        sightings.forEach((sighting) => renderOneSighting(sighting))
    } )

}

const renderOneSighting = (sighting) => {
    const li = document.createElement('li')
    li.id = sighting.id
    const form = document.createElement('form')
    form.style.display = 'block'
    
    li.innerHTML = `
        <p> ${sighting.description} </p>
        <img src=${sighting.photo} alt=${sighting.species}>
        <link href=${sighting.link}>
        <p>${sighting.likes} Likes</p>
        <button type="button" class="like"> 💟 </button>
        <button type="button" class="delete"> ❎ </button>
        <button type="button" class="toggle"> edit </button>
    `

    form.innerHTML = `
        <label for="description">
        <input type="text" class="description" placeholder="enter description">
        <br>
        <button type="submit" class="submit">submit</button>
    `
        
    li.appendChild(form)
    animalSightingsContainer.appendChild(li)
}

/********************* traveler likes ***************************/
const profile = document.querySelector('div#profile')

profile.addEventListener('click', (e) => {
    if(e.target.matches('button.like-button')) {
        const currentLikes = e.target.previousElementSibling
        const updatedNum = parseInt(currentLikes.textContent) + 1
        
        fetch(`http://localhost:3000/travelers/${travelerContainer.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ likes: updatedNum })
    })
        .then(response => response.json())
        .then(traveler => currentLikes.textContent = `${traveler.likes} Likes`)


    }
})

/********************* button functionality ***************************/
//add like functionality
//add delete functionality
//add edit functionality 
//for each functionality, update the database 

animalSightingsContainer.addEventListener('click', (e) => {

    if(e.target.matches('button.like')) {
        const id = e.target.closest('li').id
        const currentLikes = e.target.previousElementSibling
        const updatedNum = parseInt(currentLikes.textContent) + 1 



    fetch(`http://localhost:3000/animalsightings/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ likes: updatedNum })
    })
        .then(response => response.json())
        .then(sighting => currentLikes.textContent = `${sighting.likes} Likes`)

    } else if(e.target.matches('button.delete')) {

        const li = e.target.closest('li')

        fetch(`http://localhost:3000/animalsightings/${li.id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => li.remove())


    } else if(e.target.matches('button.toggle')) {

        const li = e.target.closest('li')
        const form = e.target.nextElementSibling
        
        form.style.display = form.style.display === "block" ? "none":"block"

        //update description
         if(form.style.display === "block") {
             form.addEventListener('submit', (e) => {
                e.preventDefault()
                console.log('submit')
        
                const description = e.target[0].value
                const descView = li.querySelector('p')
        
                fetch(`http://localhost:3000/animalsightings/${li.id}`, {
                    method: 'PATCH',
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    },
                    body: JSON.stringify({ 
                        description: description
                    })
                })
                .then(res => res.json())
                .then(sighting => {
                    descView.textContent = sighting.description
                    })
            })
        }
    }
})

/********************* create animal sighting ***************************/

const newSightingForm = document.querySelector('form#new-animal-sighting-form')

newSightingForm.addEventListener('submit', (e) => {
    
    e.preventDefault()

    const species = e.target[0].value
    const link = e.target[1].value
    const photo = e.target[2].value
    const description = e.target[3].value

    const newSighting = {
        species: species,
            link: link,
            photo: photo,
            description: description,
            likes: 0
    }

    fetch(`http://localhost:3000/animalsightings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(newSighting)
    })
        .then(res => res.json())
        .then(sighting => renderOneSighting(sighting))
})