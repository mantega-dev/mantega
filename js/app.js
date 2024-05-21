const apiUrl = "https://api.lanyard.rest/v1/users/532661648494952459";

const colorMap = {
    online: '#209853',
    offline: '#747781',
    idle: '#e5aa30',
    dnd: '#e93d41',
};

let progressInterval;

async function fetchUser() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        updateStatus(data.data);
        setTimeout(fetchUser, 10000);
    } catch (error) {
        console.error("Error fetching data:", error);
        setTimeout(fetchUser, 10000);
    }
}

function updateStatus(data) {
    const discordStatus = data.discord_status;
    const statusIndicator = document.getElementById('status-indicator');
    statusIndicator.style.backgroundColor = colorMap[discordStatus] || colorMap.offline;

    updateAvatar(data.discord_user);
}

function updateAvatar(user) {
    const avatarUrl = user.avatar;
    const gifUrl = `https://cdn.discordapp.com/avatars/${user.id}/${avatarUrl}.gif`;
    const pngUrl = `https://cdn.discordapp.com/avatars/${user.id}/${avatarUrl}.png`;

    const profilePicture = document.getElementById("profile-picture");
    const projectProfilePicture = document.getElementById("project_profile-picture");
    const ogImageMeta = document.getElementById("og-image-meta");

    const img = new Image();
    img.src = gifUrl;

    img.onload = () => {
        profilePicture.src = gifUrl;
        projectProfilePicture.src = gifUrl;
        if (ogImageMeta) ogImageMeta.setAttribute("content", gifUrl);
    };
    
    img.onerror = () => {
        profilePicture.src = pngUrl;
        projectProfilePicture.src = pngUrl;
        if (ogImageMeta) ogImageMeta.setAttribute("content", pngUrl);
    };
}

async function fetchSpotifyData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        updateSpotify(data.data);
        setTimeout(fetchSpotifyData, 10000);
    } catch (error) {
        console.error("Error fetching data:", error);
        setTimeout(fetchSpotifyData, 10000);
    }
}

function updateSpotify(data) {
    const isListening = data.listening_to_spotify;

    const output = document.getElementById('output');
    if (isListening) {
        const spotify = data.spotify;
        output.style.display = "flex";
        document.getElementById('song_details_container').style.display = "flex";
        document.getElementById('album_cover_container').style.display = "flex";
        document.getElementById('song').style.display = "flex";
        document.getElementById('artist').style.display = "flex";
        document.getElementById('album').style.display = "flex";
        document.getElementById('album_art_url').src = spotify.album_art_url;
        document.getElementById('song').innerText = `Listening to ${spotify.song}`;
        document.getElementById('artist').innerText = `By ${spotify.artist}`;
        document.getElementById('album').innerText = `On ${spotify.album}`;

        clearInterval(progressInterval);
        updateProgressBar(spotify.timestamps.start, spotify.timestamps.end);
    } else {
        output.style.display = "none";
        clearInterval(progressInterval);
    }
}

function updateProgressBar(startTimestamp, endTimestamp) {
    const rangeInput = document.getElementById('progress-range');
    const duration = endTimestamp - startTimestamp;

    function update() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTimestamp;
        const progress = (elapsedTime / duration) * 100;

        rangeInput.value = progress;
        rangeInput.disabled = true;
    }
    progressInterval = setInterval(update, 1000);
    update();
}

fetchUser();
fetchSpotifyData();
