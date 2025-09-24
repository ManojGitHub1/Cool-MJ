// in js/music.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DEFINE YOUR SONGS HERE ---
    const SONGS = [
        {
            title: "Middle of the Night",
            artist: "Elley Duhé",
            audioUrl: "https://aac.saavncdn.com/087/9bd48e744c7f9ffb2e14f610b3e78600_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/087/MIDDLE-OF-THE-NIGHT-English-2020-20200210192336-500x500.jpg" 
        },
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            audioUrl: "https://aac.saavncdn.com/820/5ddb9a79a5218f85ca9bef170f3a461d_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/820/Blinding-Lights-English-2020-20200912094411-500x500.jpg"
        },
        {
            title: "Play Date (Lofi)",
            artist: "Melanie Martinez",
            audioUrl: "https://aac.saavncdn.com/312/79d702abbee7e2b0322a1d725b8fe6e7_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/312/Play-Date-Lofi-English-2021-20230404222554-500x500.jpg"
        },
        {
            title: "Love Nwantiti",
            artist: "CKay",
            audioUrl: "https://aac.saavncdn.com/519/65616191585b60c8c71a49f753c30acc_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/519/CKay-The-First-English-2019-20190910210730-500x500.jpg"
        },
        {
            title: "In The End",
            artist: "Tommee Profitt, Fleurie, Jung Youth",
            audioUrl: "https://aac.saavncdn.com/374/81e63b2e25f1e577abd9878f1c26f734_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/374/In-The-End-English-2019-20250424112507-500x500.jpg"
        },
        {
            title: "MONTERO (Call Me By Your Name)",
            artist: "Lil Nas X",
            audioUrl: "https://aac.saavncdn.com/440/921db55319dc02000ded4efbfdb31153_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/440/MONTERO-English-2021-20210914233101-500x500.jpg"
        },
        {
            title: "Far From Home (The Raven)",
            artist: "Sam Tinnesz",
            audioUrl: "https://aac.saavncdn.com/490/8815b2b2adb1bcf481c241649a95f53c_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/490/Far-From-Home-The-Raven--English-2018-20180424081138-500x500.jpg"
        },
        {
            title: "Die With A Smile",
            artist: "Lady Gaga, Bruno Mars",
            audioUrl: "https://aac.saavncdn.com/060/05bb6ae7a01edcbd8e0d859d2fa1d83d_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/060/Die-With-A-Smile-English-2024-20240816103634-500x500.jpg"
        },
        {
            title: "Annihilate (From 'Spider-Man: Across the Spider-Verse')",
            artist: "Metro Boomin, Swae Lee, Lil Wayne, Offset",
            audioUrl: "https://aac.saavncdn.com/393/0e1fd5cfe1a8ef52b66b9205c0d372cc_320.mp4",
            albumArtUrl: "https://c.saavncdn.com/393/METRO-BOOMIN-PRESENTS-SPIDER-MAN-ACROSS-THE-SPIDER-VERSE-SOUNDTRACK-FROM-AND-INSPIRED-BY-THE-MOTION-PICTURE-English-2023-20230602103409-500x500.jpg"
        }
    ];

    // --- 2. STATE & UTILS ---
    let currentSongIndex = 0;
    let isPlaying = false;
    
    // --- 3. CACHE DOM ELEMENTS ---
    const audioPlayer = document.getElementById('audio-player');
    const widget = document.getElementById('music-widget');
    const albumArtCollapsed = document.getElementById('album-art-collapsed');
    const albumArtExpanded = document.getElementById('album-art-expanded');
    const songTitleCollapsed = document.getElementById('song-title-collapsed');
    const songTitleExpanded = document.getElementById('song-title-expanded');
    const songArtistExpanded = document.getElementById('song-artist-expanded');
    
    const playPauseBtnCollapsed = document.getElementById('play-pause-collapsed');
    const playPauseBtnExpanded = document.getElementById('play-pause-expanded');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const expandBtn = document.getElementById('expand-btn');
    const collapseBtn = document.getElementById('collapse-btn');
    const playlistBtn = document.getElementById('playlist-btn');
    const closePlaylistBtn = document.getElementById('close-playlist-btn');
    const playlistContainer = document.getElementById('playlist-container');

    const progressContainer = document.getElementById('progress-container');
    const waveformProgress = document.getElementById('waveform-progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volume-slider');

    // --- 4. CORE FUNCTIONS ---
    function loadSong(song) {
        audioPlayer.src = song.audioUrl;
        albumArtCollapsed.src = song.albumArtUrl;
        albumArtExpanded.src = song.albumArtUrl;
        songTitleCollapsed.textContent = `${song.title} • ${song.artist}`;
        songTitleExpanded.textContent = song.title;
        songArtistExpanded.textContent = song.artist;
        renderPlaylist();
    }

    function playSong() {
        isPlaying = true;
        widget.classList.add('playing');
        playPauseBtnCollapsed.innerHTML = `<i class='bx bx-pause'></i>`;
        playPauseBtnExpanded.innerHTML = `<i class='bx bx-pause'></i>`;
        audioPlayer.play().catch(error => console.error("Audio Playback Error:", error));
    }

    function pauseSong() {
        isPlaying = false;
        widget.classList.remove('playing');
        playPauseBtnCollapsed.innerHTML = `<i class='bx bx-play'></i>`;
        playPauseBtnExpanded.innerHTML = `<i class='bx bx-play'></i>`;
        audioPlayer.pause();
    }
    
    function togglePlayPause(e) { if(e) e.stopPropagation(); isPlaying ? pauseSong() : playSong(); }
    function prevSong() { currentSongIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length; loadSong(SONGS[currentSongIndex]); playSong(); }
    function nextSong() { currentSongIndex = (currentSongIndex + 1) % SONGS.length; loadSong(SONGS[currentSongIndex]); playSong(); }
    function formatTime(seconds) { const minutes = Math.floor(seconds / 60); const secs = Math.floor(seconds % 60); return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; }

    function updateProgress() {
        const { duration, currentTime } = audioPlayer;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            waveformProgress.style.clipPath = `inset(0 ${100 - progressPercent}% 0 0)`;
            currentTimeEl.textContent = formatTime(currentTime);
        }
    }
    
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        if (duration) {
            audioPlayer.currentTime = (clickX / width) * duration;
        }
    }
    
    function setVolume() {
        audioPlayer.volume = volumeSlider.value / 100;
        const volumePercent = volumeSlider.value;
        volumeSlider.style.background = `linear-gradient(to right, var(--widget-accent-color) ${volumePercent}%, var(--slider-track-color) ${volumePercent}%)`;
    }
    
    function renderPlaylist() {
        playlistContainer.innerHTML = '';
        SONGS.forEach((song, index) => {
            const isActive = index === currentSongIndex;
            const songEl = document.createElement('div');
            songEl.classList.add('playlist-song');
            if (isActive) songEl.classList.add('active');
            
            songEl.innerHTML = `
                <img src="${song.albumArtUrl}" alt="${song.title}" class="playlist-album-art">
                <div class="playlist-song-info">
                    <p class="playlist-title">${song.title}</p>
                    <p class="playlist-artist">${song.artist}</p>
                </div>
                ${isActive && isPlaying ? `<i class='bx bx-volume-full playlist-playing-icon'></i>` : ''}
            `;
            songEl.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(SONGS[currentSongIndex]);
                playSong();
                widget.classList.remove('playlist-open');
            });
            playlistContainer.appendChild(songEl);
        });
    }

    // --- 5. EVENT LISTENERS ---
    playPauseBtnCollapsed.addEventListener('click', togglePlayPause);
    playPauseBtnExpanded.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    expandBtn.addEventListener('click', () => widget.classList.add('expanded'));
    collapseBtn.addEventListener('click', () => widget.classList.remove('expanded'));
    
    playlistBtn.addEventListener('click', () => widget.classList.add('playlist-open'));
    closePlaylistBtn.addEventListener('click', () => widget.classList.remove('playlist-open'));

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('ended', nextSong);
    
    progressContainer.addEventListener('click', setProgress);
    
    volumeSlider.addEventListener('input', setVolume);

    // --- 6. INITIALIZATION ---
    loadSong(SONGS[currentSongIndex]);
    renderPlaylist();
    setVolume();
});