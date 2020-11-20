
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Typography, Radio } from 'antd';
// import videojs from 'video.js/dist/video.min';
import zh from 'video.js/dist/lang/zh-CN.js'
import ZhCNJSON from 'video.js/dist/lang/zh-CN.json'
// import Flash from 'videojs-flash';
import SWF_PATH from 'videojs-swf/dist/video-js.swf';
// import VTTJS_PATH from 'file!videojs-vtt.js/dist/vtt.min.js';
import 'video.js/dist/video-js.min.css';
import { usePersistFn, useCreation } from 'ahooks';

import styles from './index.less';

const { Title } = Typography;

// videojs.options.flash.swf = SWF_PATH;
// videojs.options['vtt.js'] = VTTJS_PATH;

interface Source {
  src:    string;
  type:   string;
  poster: string;
};

enum SourceType {
  FLV = 'FLV',
  M3U8 = 'M3U8'
};

const optionMap = {
  [SourceType.FLV]: {
    controls: true, // 是否显示控制条
    flash: {
      swf: SWF_PATH,
    },
    techOrder: ["Html5", 'Flash'],
    sources: [
      {
        src: 'https://jdpull.jd.com/live/2747037.flv',
        type: 'video/flv',
        poster: '//vjs.zencdn.net/v/oceans.png'
      }
    ]
  },
  [SourceType.M3U8]: {
    controls: true, // 是否显示控制条
    techOrder: ["Html5", 'Flash'],
    // flash: {
    //   swf: require('videojs-swf/dist/video-js.swf'),
    // },
    sources: [
      {
           src: 'https://jdpull.jd.com/live/2747037_fhd.m3u8',
           type: 'application/x-mpegURL',
           poster: '//vjs.zencdn.net/v/oceans.png'
         },
    ]
  }
}

const addScript = (url: string,callback: Function) => {
  const head = document.getElementsByTagName('body')[0];
  const script: any = document.createElement('script');
  script.type = 'text/javascript';
  script.onload = script.onreadystatechange = function () {
    if (!this.readyState || this.readyState === "loaded"
      || this.readyState === "complete") {
        callback && callback();
      // Handle memory leak in IE
      script.onload = script.onreadystatechange = null;
    }
  };
  script.src = url;
  head.appendChild(script);
};

export default (): React.ReactNode => {
  const [sourceType, setSourceType] = useState<SourceType>(SourceType.FLV);
  const videoEl = useRef({});
  const player = useRef<any>(null);
  const option = useMemo(() => {
    return optionMap[sourceType];
  }, [sourceType]);
  const initVideo = usePersistFn(() => {
    if (!videoEl.current) {
      player.current = undefined;
      return
    }
    console.log('确认进入视频')
    if (player.current[sourceType]) {
      player.current[sourceType].dispose();
    }
    console.log(videoEl.current[sourceType]);
    player.current = (window as any).videojs(videoEl.current[sourceType], option, function onPlayerReady() {

    });
  });
  useEffect(() => {
    addScript('https://vjs.zencdn.net/7.10.1/video.min.js', () => {
      addScript('https://cdn.jsdelivr.net/npm/videojs-flash@2/dist/videojs-flash.min.js', () => {
        initVideo();
      });
    });
  }, [sourceType]);
  return (
    <PageContainer>
      <div className={styles.header}>
        <Title style={{ marginBottom: 0 }} level={3}>视频播放源切换</Title>
        <Radio.Group onChange={(e) => setSourceType(e.target.value)} value={sourceType} buttonStyle="solid">
          <Radio.Button value={SourceType.FLV}>{SourceType.FLV}</Radio.Button>
          <Radio.Button value={SourceType.M3U8}>{SourceType.M3U8}</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <video ref={c => videoEl.current[SourceType.FLV]} className={`video-js vjs-big-play-centered ${styles.video}`} >
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
              </a>
          </p>
        </video>
        {/* <video key={sourceType} ref={videoEl} className={`video-js vjs-big-play-centered ${styles.video}`} >
          <p className="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
              web browser that
              <a href="https://videojs.com/html5-video-support/" target="_blank">
              supports HTML5 video
              </a>
          </p>
        </video> */}
      </div>
    </PageContainer>
  )
};

