const FileInputD = document.querySelector('.FileInput');
let SpinePlayerObj;
let anims = [];
let animIndex = 0;

const setupPlayer = (dragonName, res) => {
    FileInputD.remove();

    let spinePlayerConfig = {
        skelUrl: `../files/extracted/${dragonName.replace(/"/g, '')}.zip/${dragonName.replace(/"/g, '')}.skel`,
        atlasUrl: `../files/extracted/${dragonName.replace(/"/g, '')}.zip/${dragonName.replace(/"/g, '')}.atlas`,
        viewport: {
            x: 0,
            y: 0,
            width: 350,
            height: 200,
            padLeft: "35%"
        },
        rawDataURIs: {
            ...res.data
        },
        premultipliedAlpha: false,
        showControls: false
    };

    let isEternalFatality = dragonName.includes('fatality');

    if(isEternalFatality){
        spinePlayerConfig.viewport = {};
    }

    if(transparentBG){
        spinePlayerConfig.alpha = true;
        spinePlayerConfig.backgroundColor = '#00000000';
    }
    else if(bgIMGNAME){
        spinePlayerConfig.alpha = true;
        spinePlayerConfig.backgroundColor = '#00000000';

        spinePlayerConfig.backgroundImage = {
            url: `../files/backgrounds/${bgIMGNAME.replace(/"/g, '')}`
        };
    }
    else{
        spinePlayerConfig.backgroundColor = CanvasBGColor;
    }

    SpinePlayerObj = new spine.SpinePlayer("SpinePlayer__canvas_container", spinePlayerConfig);

    // console.log(SpinePlayerObj);

    setupButtons(SpinePlayerObj, isEternalFatality);
}

const getDataURIsAndSetupPlayer = (dragonName, res) => {
    // console.log('hola?');

    if(res.data.pngExists){
        // console.log('hol a' + ' ' + dragonName);
        setupPlayer(dragonName, res);
    }
    else{
        setTimeout(() => {
            reqDataUris(dragonName);
        }, 100);
    }
}

const reqDataUris = (dragonName, path) => {
    axios.post('/datauri', { name: dragonName.replace(/"/g, '') }).then(res => {
        getDataURIsAndSetupPlayer(dragonName, res);
    });
}

const setupButtons = (sPlayer, isEternalFatalitySkill) => {
    const SpinePlayerBtnsContainer = document.createElement('div');
    SpinePlayerBtnsContainer.classList.add('SpinePlayer__canvas_container_buttons_container');

    const changeAnimContainer = document.createElement('div');
    changeAnimContainer.classList.add('SpinePlayer__canvas_container_changeanim_container');

    const changeAnimBtn = document.createElement('button');
    changeAnimBtn.innerHTML = 'Change animation';
    changeAnimBtn.classList.add('SpinePlayer__canvas_container_changeanim_btn');

    const changeAnimLabel = document.createElement('label');

    // sPlayer.animationState.tracks[0].animation.name

    const setScaleBtn = document.createElement('button');
    setScaleBtn.innerHTML = 'Set scale';
    setScaleBtn.classList.add('SpinePlayer__canvas_container_setscale_btn');

    const startRecordingBtn = document.createElement('button');
    startRecordingBtn.innerHTML = 'Start recording';
    startRecordingBtn.classList.add('SpinePlayer__canvas_container_startrecording_btn');

    const setScaleContainer = document.createElement('div');
    setScaleContainer.classList.add('SpinePlayer__canvas_container_setscale_container');

    const setScaleInputContainer = document.createElement('div');
    setScaleInputContainer.classList.add('SpinePlayer__canvas_container_setscale_input_container');

    const setScaleInput = document.createElement('input');
    setScaleInput.type = 'number';
    setScaleInput.value = '1';
    setScaleInput.min = '0.5';
    setScaleInput.max = '22';
    setScaleInput.step = '0.1';
    setScaleInput.id = 'animationscale';

    const setScaleLabel = document.createElement('label');
    setScaleLabel.innerHTML = 'Animation scale';
    setScaleLabel.htmlFor = 'animationscale';

    const secondsToRecordContainer = document.createElement('div');
    secondsToRecordContainer.classList.add('SpinePlayer__canvas_container_secondstorecord_container')

    const secondsToRecordInput = document.createElement('input');
    secondsToRecordInput.type = 'number';
    secondsToRecordInput.value = '1';
    secondsToRecordInput.min = '1';
    secondsToRecordInput.max = '25';
    secondsToRecordInput.id = 'secondstorecord';

    const secondsToRecordLabel = document.createElement('label');
    secondsToRecordLabel.innerHTML = 'Seconds to record (default 1, max 25)';
    secondsToRecordLabel.htmlFor = 'secondstorecord';

    const viewportSettingsBtn = document.createElement('button');
    viewportSettingsBtn.innerHTML = 'Viewport settings';
    viewportSettingsBtn.classList.add('SpinePlayer__canvas_container_vpsettings_btn');

    let animScale;
    let recordTime;

    viewportSettingsBtn.addEventListener('click', (e) => {
        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('vpsettings__container');

        const vpsettings = document.createElement('div');
        vpsettings.classList.add('vpsettings');

        const html = `
            <p class="vpsettings_close">X</p>

            <div class="vpsettings__pad_container">
                <input type="number" id="padleft" min="0" max="200" value="${sPlayer.config.viewport.padLeft?.replace('%', '') || '30'}" />
                <label for="padleft">Left padding (in %)</label>
            </div>

            <div class="vpsettings__pad_container">
                <input type="number" id="padtop" min="0" max="200" value="${sPlayer.config.viewport.padTop?.replace('%', '') || '0'}" />
                <label for="padtop">Top padding (in %)</label>
            </div>

            <button class="vpsettings__apply_btn">Apply changes</button>
        `;

        vpsettings.innerHTML = html;
        optionsContainer.append(vpsettings);

        const padLeftInput = optionsContainer.querySelector('.vpsettings #padleft');
        const padTopInput = optionsContainer.querySelector('.vpsettings #padtop');
        const applyChangesBtn = optionsContainer.querySelector('.vpsettings__apply_btn');
        const vpSettingsCloseBtn = optionsContainer.querySelector('.vpsettings_close');

        vpSettingsCloseBtn.addEventListener('click', (e) => {
            optionsContainer.remove();
        });

        applyChangesBtn.addEventListener('click', (e) => {
            sPlayer.config.viewport = {
                ...sPlayer.config.viewport,
                padLeft: `${padLeftInput.value}%`,
                padTop: `${padTopInput.value}%`
            };

            changeAnimBtn.click();
            alert('Successfully applied viewport changes');
            vpSettingsCloseBtn.click();
        });

        document.querySelector('#Home').append(optionsContainer);
    });

    changeAnimBtn.addEventListener('click', (e) => {
        anims = sPlayer.animationState.data.skeletonData.animations.map(anim => anim.name);
        
        let setLabel = () => changeAnimLabel.innerHTML = `Playing "${sPlayer.animationState.tracks[0].animation.name}"`;

        if(animIndex == (anims.length - 1)){
            animIndex = 0;
            sPlayer.setAnimation(anims[animIndex]);
            setLabel();
            
            if(animScale){
                sPlayer.skeleton.bones[0].scaleX = isEternalFatalitySkill ? animScale : animScale / 10;
                sPlayer.skeleton.bones[0].scaleY = isEternalFatalitySkill ? animScale : animScale / 10;
            }
        }
        else{
            animIndex++;
            sPlayer.setAnimation(anims[animIndex]);
            setLabel();

            if(animScale){
                sPlayer.skeleton.bones[0].scaleX = isEternalFatalitySkill ? animScale : animScale / 10;
                sPlayer.skeleton.bones[0].scaleY = isEternalFatalitySkill ? animScale : animScale / 10;
            }
        }
    });

    setScaleInput.addEventListener('change', (e) => {
        animScale = +setScaleInput.value;
    });

    setScaleBtn.addEventListener('click', (e) => {
        /*sPlayer.skeleton.bones.forEach(bone => {
            bone.scaleX = animScale;
            bone.scaleY = animScale;
        });*/
        sPlayer.skeleton.bones[0].scaleX = isEternalFatalitySkill ? animScale : animScale / 10;
        sPlayer.skeleton.bones[0].scaleY = isEternalFatalitySkill ? animScale : animScale / 10;
    });

    secondsToRecordInput.addEventListener('change', (e) => {
        recordTime = secondsToRecordInput.value;
    });

    startRecordingBtn.addEventListener('click', (e) => {
        recordCanvas(+recordTime * 1000);
    });

    secondsToRecordContainer.append(secondsToRecordInput, secondsToRecordLabel);

    setScaleInputContainer.append(setScaleInput, setScaleLabel);
    setScaleContainer.append(setScaleInputContainer);

    changeAnimContainer.append(changeAnimBtn, changeAnimLabel);
    
    //if(isEternalFatalitySkill){
        SpinePlayerBtnsContainer.append(changeAnimContainer, setScaleContainer, setScaleBtn, viewportSettingsBtn, secondsToRecordContainer, startRecordingBtn);
    //}
    //else{
        //SpinePlayerBtnsContainer.append(changeAnimBtn, secondsToRecordContainer, startRecordingBtn);
    //}

    document.querySelector('.SpinePlayer__canvas_container').appendChild(SpinePlayerBtnsContainer);
}

const recordCanvas = (time) => {
    let canvas = document.querySelector('.spine-player-canvas');

    const recording = record(canvas, time);

    /*const video = document.createElement('video');
    video.classList.add('Home__output_video');*/

    const downloadLink = document.createElement('a');
    downloadLink.classList.add('Home__output_video_link');

    downloadLink.addEventListener('click', () => {
        setTimeout(() => {
            downloadLink.remove();
        }, 650);
    });

    recording.then((url) => {
        document.querySelector('.SpinePlayer__container').append(/*video,*/ downloadLink);
        //video.setAttribute('src', url);
        downloadLink.setAttribute('download', 'output');
        downloadLink.setAttribute('href', url);
        downloadLink.innerHTML = 'Download output video';
        alert('Done recording your video, if you want to see/record more animations reload the page');
    });
}

function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}
  
function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
}