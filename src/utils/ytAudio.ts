// YouTube Background IFrame Audio Player Controller
// Video: VlyLyBqNvVE ("Gautam Prasad Portfolio Soundtrack")

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

class YouTubeMusicPlayer {
  private player: any = null;
  private isReady: boolean = false;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private listeners: ((playing: boolean) => void)[] = [];
  private videoId: string = 'VlyLyBqNvVE';
  private containerId: string = 'yt-bg-audio-container';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadYouTubeIframeAPI();
    }
  }

  private loadYouTubeIframeAPI() {
    if (document.getElementById('yt-iframe-api-script')) return;

    const tag = document.createElement('script');
    tag.id = 'yt-iframe-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      this.initPlayer();
    };

    // If script is already loaded by another instance
    if (window.YT && window.YT.Player) {
      this.initPlayer();
    }
  }

  private initPlayer() {
    if (this.player || typeof document === 'undefined') return;

    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-1';
      document.body.appendChild(container);
    }

    try {
      this.player = new window.YT.Player(this.containerId, {
        height: '100',
        width: '100',
        videoId: this.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: this.videoId,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            this.isReady = true;
            event.target.setVolume(60);
            if (!this.isMuted) {
              event.target.playVideo();
              this.isPlaying = true;
              this.notify();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING is 1, PAUSED is 2, ENDED is 0
            if (event.data === 1) {
              this.isPlaying = true;
              this.isMuted = false;
            } else if (event.data === 2 || event.data === 0) {
              this.isPlaying = false;
            }
            this.notify();
          },
          onError: (e: any) => {
            console.warn('YouTube Background Audio note:', e);
          },
        },
      });
    } catch (err) {
      console.warn('Could not initialize YouTube Player:', err);
    }
  }

  public async toggleMusic(): Promise<boolean> {
    this.isMuted = !this.isMuted;

    if (!this.player || !this.isReady) {
      this.initPlayer();
    }

    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        if (!this.isMuted) {
          this.player.unMute();
          this.player.setVolume(65);
          this.player.playVideo();
          this.isPlaying = true;
        } else {
          this.player.pauseVideo();
          this.isPlaying = false;
        }
      } catch (e) {
        console.warn('YT player toggle error:', e);
      }
    }

    this.notify();
    return !this.isMuted;
  }

  public getIsPlaying(): boolean {
    return !this.isMuted && this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  private notify() {
    const active = !this.isMuted;
    this.listeners.forEach((cb) => cb(active));
  }
}

export const ytMusic = new YouTubeMusicPlayer();
