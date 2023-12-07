const apiUrl = "https://api.lanyard.rest/v1/users/532661648494952459";

function fetchDataAndLog() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const discordStatus = data.data.discord_status;
            setTimeout(fetchDataAndLog, 10000);

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
            const gifUrl = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.gif`;
            const img = new Image();
            img.src = gifUrl;
            img.onload = () => {
                profilePicture.src = gifUrl;
                const ogImageMeta = document.getElementById("og-image-meta");
                if (ogImageMeta) {
                    ogImageMeta.setAttribute("content", gifUrl);
                }
            };
            img.onerror = () => {
                profilePicture.src = `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.png`;
                const ogImageMeta = document.getElementById("og-image-meta");
                if (ogImageMeta) {
                    ogImageMeta.setAttribute("content", `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${avatarUrl}.png`);
                }
            };
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            setTimeout(fetchDataAndLog, 10000);
        });
}
fetchDataAndLog();
