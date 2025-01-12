// TODO: Figure out if there's away to tell if the
// video isn't available and send a better message
// than the youtube default one. or maybe play 
// a different video all together 

class YouTubePlayer extends HTMLElement {
  connectedCallback() {
    console.log(this.dataset.id);
    this.init();
  }

  async init() {
    this.loadApi();
    await this.apiLoader;
    const videoPlaceholderEl = document.createElement('div')
    this.append(videoPlaceholderEl);
    this.player = await new Promise(resolve => {
        let player = new YT.Player(videoPlaceholderEl, {
            width: "320",
            height: "195",
            videoId: this.dataset.id,
            playerVars: {},
            events: {
                "onReady": event => {
                    resolve(player);
                }
            }
        });
    }).then((value) => {return value});
    this.addButtons(this.player);
    // TODO: Figure out how to handle errors here. 
  }

  addButtons(player) {
    const playButtonEl = document.createElement('button');
    playButtonEl.innerHTML = "Play";
    playButtonEl.addEventListener("click", (event) => {
      this.doPlayPause.call(this, event, this.player)
    });
    this.appendChild(playButtonEl);
  }

  doPlayPause(event, player) {
    const buttonEl = event.target;
    const playerStatus = player.getPlayerState();
    // The docs don't list a YT.PlayerState.UNSTARTED
    // flag so using the explicit `-1` instead
    if (
      playerStatus == -1 ||
      playerStatus == YT.PlayerState.ENDED ||
      playerStatus == YT.PlayerState.PAUSED ||
      playerStatus == YT.PlayerState.BUFFERING ||
      playerStatus == YT.PlayerState.CUED
    ) {
      player.playVideo();
      buttonEl.innerHTML = "Pause";
      // TODO: Figure out how to shift focus to
      // the player so keyboard controls work
    } else {
      player.pauseVideo();
      buttonEl.innerHTML = "Play";
    }
  }

  loadApi() {
    // this if is from Paul Irish's embed, not sure why 
    // the OR condition with window.YT.Player is there since
    // it seems like the window.YT would always hit first
    if (window.YT || (window.YT && window.YT.Player)) {
      return;
    }

    this.apiLoader = new Promise((res, rej) => {
        var el = document.createElement('script');
        el.src = 'https://www.youtube.com/iframe_api';
        el.async = true;
        el.onload = _ => {
            YT.ready(res);
        };
        el.onerror = rej;
        this.append(el);
    });
  }

}
customElements.define('yt-player', YouTubePlayer);

/*
var tag = document.createElement("script")
tag.src = "https://www.youtube.com/iframe_api"
var firstScriptTag = document.getElementsByTagName("script")[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
const ytPlayers = []
function onYouTubeIframeAPIReady() {
  ytPlayers[0] = new YT.Player("ytPlayer-1", {
    height: "195",
    width: "320",
    videoId: "_YUzQa_1RCE",
    playerVars: {
      "playsinline": 1
    },
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  })
}

function onPlayerReady(event) {
  console.log("ytPlayer: ready")
  addYtButtons(event.target)
}

function onPlayerStateChange(event) {
  if (event.data == -1) {
    console.log("ytPlayer: unstarted")
  } else if (playerStatus == 0) {
    console.log("ytPlayer: ended")
  } else if (playerStatus == 1) {
    console.log("ytPlayer: playing")
  } else if (playerStatus == 2) {
    console.log("ytPlayer: paused")
  } else if (playerStatus == 3) {
    console.log("ytPlayer: buffering")
  } else if (playerStatus == 5) {
    console.log("ytPlayer: cued")
  }
}

function addYtButtons(player) {
  const playerEl = player.g
  const playerWrapper = playerEl.parentElement
  const buttonWrapperEl = document.createElement("div")
  const playButtonEl = document.createElement("button")
  playButtonEl.innerHTML = "Play"
  playButtonEl.addEventListener("click", (event, playerEl) => { playVideo(event, playerEl) })
  buttonWrapperEl.appendChild(playButtonEl)
  playerWrapper.appendChild(buttonWrapperEl)
}

function playVideo(event, playerEl) {
  console.log(event)
  console.log(playerEl)
}
*/
