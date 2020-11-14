/* 1. Do the search */


var UI = {};

UI.buttonClick = function() {

    document.querySelector('.js-submit').addEventListener('click',function(){
      var input = document.querySelector('.js-search').value;
      var searchResults = document.querySelector('.js-search-results');
      searchResults.innerHTML = '';
     // console.log(e);
     // document.querySelector('js-search').value = '';
      SoundCloudAPI.getTracks(input);
    
  });

}



UI.pressEnter = function() {
  document.querySelector('.js-search').addEventListener('keyup',function(e){
      var input = document.querySelector('.js-search').value;
      var searchResults = document.querySelector('.js-search-results');
      if(e.which === 13){
        searchResults.innerHTML = '';
        SoundCloudAPI.getTracks(input);
      }
 });

}


UI.clearPlaylist = function() {
  document.querySelector('.js-clear').addEventListener('click',function(){
    if(localStorage.getItem('key') !== null)
    {
      localStorage.removeItem('key');
      var leftCol = document.querySelector('.js-playlist');
      leftCol.innerHTML = '';
    }
    return;
  });
}

UI.clearPlaylist();
UI.buttonClick();
UI.pressEnter();

/* 2. Query Soundcloud API */

var SoundCloudAPI = {};

SoundCloudAPI.init = function() {
  
  SC.initialize({
    client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
  });

}

SoundCloudAPI.init();

SoundCloudAPI.getTracks = function(input) {

  SC.get('/tracks', {
    q: input //'buskers'//, license: 'cc-by-sa'
  }).then(function(tracks) {
    console.log(tracks);
    SoundCloudAPI.renderTracks(tracks);
    });
}

//SoundCloudAPI.getTracks("Foo Fighters");

/* 3. Display the cards */
SoundCloudAPI.renderTracks = function(tracks) {

  tracks.forEach(function(track) {

    //card
    var card = document.createElement('div');
    card.classList.add('card');

    //image
    var imgDiv = document.createElement('div');
    imgDiv.classList.add('image');
    //imgDiv.className = "image";
  
    var img = document.createElement('img');
    img.classList.add('image_img');
    imgDiv.appendChild(img);
    var source = track.artwork_url;
    if(source != null)
      var out = source.replace("large","t500x500");
    img.src = out || 'https://lorempixel.com/output/abstract-q-c-650-650-8.jpg';
  

    //content
    var contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
  
    var header = document.createElement('div');
    header.classList.add('header');
    contentDiv.appendChild(header);
    header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + '</a>';

    //button
    var addButton = document.createElement('div');
    addButton.classList.add('ui', 'bottom', 'attached', 'button', 'js-button');
  
    var i = document.createElement('i');
    i.classList.add('add', 'icon');

    addButton.appendChild(i);
    var addText = document.createElement('span');
    addText.innerHTML = "Add to Playlist";
    addButton.appendChild(addText);

    addButton.addEventListener('click',function(){
      SoundCloudAPI.addToPlaylist(track.permalink_url);

    });

    //append all three to card
    card.appendChild(imgDiv);
    card.appendChild(contentDiv);
    card.appendChild(addButton);

    //append card to it's baap
    var searchResults = document.querySelector('.js-search-results');
    searchResults.appendChild(card);

  });
    
}



/* 4. Add to playlist and play */

SoundCloudAPI.addToPlaylist = function(url){

  SC.oEmbed(url, {
    auto_play: false
  }).then(function(embed){
    console.log('oEmbed response: ', embed);

    var leftCol = document.querySelector('.js-playlist');
    var box = document.createElement('div');
    box.innerHTML = embed.html;
    leftCol.insertBefore(box, leftCol.firstChild);

    localStorage.setItem('key',leftCol.innerHTML);
 
    
  });
}

//local storage
var sideBar = document.querySelector(".js-playlist");
sideBar.innerHTML = localStorage.getItem('key');

