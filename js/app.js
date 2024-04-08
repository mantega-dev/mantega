const apiUrl = "https://api.lanyard.rest/v1/users/532661648494952459";

function fetchUser() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const discordStatus = data.data.discord_status;
            setTimeout(fetchUser, 10000);

            const statusIndicator = document.getElementById('status-indicator');

            const colorMap = {
                online: '#209853',
                offline: '#747781',
                idle: '#e5aa30',
                dnd: '#e93d41',
            };

            statusIndicator.style.backgroundColor = colorMap[discordStatus] || '#747781';
            const avatarUrl = data.data.discord_user.avatar;

            const profilePicture = document.getElementById("profile-picture");
            const projectProfilePicture = document.getElementById("project_profile-picture");
            
            const gifUrl = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.gif`;
            const img = new Image();
            img.src = gifUrl;
            img.onload = () => {
                profilePicture.src = gifUrl;
                projectProfilePicture.src = gifUrl;
                const ogImageMeta = document.getElementById("og-image-meta");
                if (ogImageMeta) {
                    ogImageMeta.setAttribute("content", gifUrl);
                }
            };
            img.onerror = () => {
                profilePicture.src = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.png`;
                projectProfilePicture.src = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.png`;
                const ogImageMeta = document.getElementById("og-image-meta");
                if (ogImageMeta) {
                    ogImageMeta.setAttribute("content", `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.png`);
                }
            };

            if (data.data.listening_to_spotify === true) {
                document.getElementById('output').style.display = "flex";
                document.getElementById('song_details_container').style.display = "flex";
                document.getElementById('album_cover_container').style.display = "flex";
                document.getElementById('song').style.display = "flex";
                document.getElementById('artist').style.display = "flex";
                document.getElementById('album').style.display = "flex";
                document.getElementById('album_art_url').src = data.data.spotify.album_art_url;
                document.getElementById('song').innerText = "Listening to " + data.data.spotify.song;
                document.getElementById('artist').innerText = "By " + data.data.spotify.artist;
                document.getElementById('album').innerText = "On " + data.data.spotify.album;

                let startTimestamp = data.data.spotify.timestamps.start;
                let endTimestamp = data.data.spotify.timestamps.end;

                let duration = endTimestamp - startTimestamp;

                let progressBar = document.getElementById('progress-bar');

                function updateProgressBar() {
                    let currentTime = Date.now();
                    let elapsedTime = currentTime - startTimestamp;

                    let progress = (elapsedTime / duration) * 100;

                    progressBar.style.width = `${progress}%`;

                    if (currentTime >= endTimestamp) {
                        clearInterval(progressInterval);

                        setTimeout(updateProgressBar, 1000);
                    }
                }

                updateProgressBar();

                const progressInterval = setInterval(updateProgressBar, 1000);

            } else if (data.data.listening_to_spotify === false) {
                document.getElementById('output').style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setTimeout(fetchUser, 10000);
        });
}
fetchUser();
