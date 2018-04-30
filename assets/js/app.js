let songs = {};

//inicializa soundcloud
SC.initialize({
    client_id: 'sAoIf2ba0JnODuFmAJmRQrV0TbrmoF8e'
});
$("#inputSearch").on("keydown", function(e){
    if(e.key === "Enter"){
        buscar($("#inputSearch").val());
    }
});

function buscar(valor){
    SC.get('/tracks', {
        q: valor, license: 'cc-by-sa'
    }).then(function(tracks) {
        renderTracks(tracks);
    });
}

function renderTracks(tracks){
    songs = tracks;
    $("#songsRow").empty();
    tracks.forEach((song)=>{
        let path = '';
        let id= ''+song.id;
        if(song.artwork_url !== null) path = song.artwork_url;
        else path = 'assets/img/nota.jpg';
            $("#songsRow").append("<div><img  ondragstart='drag(event)' drawable='true' id='"+id+"' src='"+path+"'></div>")
    });
}

function drag(e){
    e.dataTransfer.setData("text", e.target.id);
    $("#playerFrame").empty();
    $("#divSongTitle").empty();
}

function allowDrop(e){
    e.preventDefault();
}

function drop(e){
    e.preventDefault();
    var data = e.dataTransfer.getData("text");
    e.target.appendChild(document.getElementById(data));
    play(data);
}

function play(id){
    SC.stream('/tracks/'+id).then(function(player){
        player.play().then(function(){
            //console.log('Playback started!');
            showTitle(id);
        }).catch(function(e){
            console.error('Playback rejected. Try calling play() from a user interaction.', e);
        });
    });
}

function showTitle(id){
    songs.forEach((song)=>{
        if(song.id === Number(id)){
            $("#divSongTitle").append(song.title);
            showTime(song.duration);
        }
    });
}

function showTime(duration){
    let time = duration/1000/60;
    time = Math.round(time * 100) / 100; console.log(time);
    $("#divSongTime span").html(time);
}