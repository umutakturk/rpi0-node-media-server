const NodeMediaServer = require('node-media-server');
const path = require('path');

const currentStreams = new Set();

(async () => {
  const nms = new NodeMediaServer({
    rtmp: {
      port: process.env.RTMP_PORT || 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 60,
      ping_timeout: 30
    },
    http: {
      port: process.env.HTTP_PORT || 5000,
      mediaroot: './media',
      allow_origin: '*'
    },
    trans: {
      ffmpeg: path.resolve(__dirname, 'tools/ffmpeg'),
      tasks: [
        {
          app: 'live',
          ac: 'aac',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]'
        }
      ]
    }
  });

  nms.on('prePublish', id => {
    if (!currentStreams.has(id)) {
      currentStreams.add(id);
    }
  });

  nms.on('donePublish', id => {
    currentStreams.delete(id);
  });

  nms.run();
})();