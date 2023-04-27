/*---- color input ----- */

const ColorInput = document.querySelector('#upload-bg_color');
let CanvasBGColor = ColorInput.value;

ColorInput.addEventListener('change', (e) => {
    CanvasBGColor = ColorInput.value;
});

/*------ alpha input ---- */
const alphaInput = document.getElementById('alpha');
const alphaInputClicked = document.querySelector('.Home_transparent-bg_input_clicked');

let transparentBG = false;

const alphaInputLabelContainer = document.querySelector('.Home__transparent-bg_input_container');
const alphaInputLabel = document.querySelector('.Home__transparent-bg_input');

alphaInputLabelContainer.addEventListener('click', (e) => {
    // alphaInput.dispatchEvent(new Event('change'));
    alphaInput.click();
});

alphaInputLabel.addEventListener('click', (e) => {
    e.preventDefault();
});

alphaInput.addEventListener('change', (e) => {
    transparentBG = alphaInput.checked;
    
    if(transparentBG){
        alphaInputClicked.classList.add('Home_transparent-bg_input_clicked-click');
    }
    else{
        alphaInputClicked.classList.remove('Home_transparent-bg_input_clicked-click');
    }
});

/*----- bg image input -----*/
const imageInput = document.querySelector('#upload-bg_image');
const imageInputLabel = document.querySelector('.Home__bg-image_input_label');

let bgIMGNAME = '';

imageInput.addEventListener('change', (e) => {
    const reader = new FileReader();

    reader.readAsDataURL(imageInput.files[0]);

    reader.addEventListener('load', (ev) => {
        const data = ev.target.result;

        bgIMGNAME = 'BG-' + imageInput.files[0].name;

        axios.post("/bg",
            {
                "filename": bgIMGNAME,
                "data": data
            }
        );
    });
});