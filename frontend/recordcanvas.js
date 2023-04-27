const record = (canvas, timeInMS) => {
    let recordedChunks = [];

    return new Promise((res, rej) => {
        let stream = canvas.captureStream(60);
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9" // "video/webm;codecs:vp9"
        });

        mediaRecorder.start(timeInMS || 4000);

        mediaRecorder.ondataavailable = (ev) => {
            recordedChunks.push(ev.data);

            if(mediaRecorder.state == 'recording'){
                mediaRecorder.stop();
            }
        }

        mediaRecorder.onstop = (ev) => {
            let blob = new Blob(recordedChunks, { type: 'video/webm' });
            let url = URL.createObjectURL(blob);

            res(url);
        }
    })
};