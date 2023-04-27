const BGListContainer = document.querySelector('#bglist-container');
const BGList = document.querySelector('#bglist');
const openBGListBtn = document.querySelector('#openbglist');
const closeBgBtn = document.querySelector('.Home__bg-list_close');

const backgrounds = document.querySelectorAll('.Bg-image__list_item');

backgrounds.forEach(bg => {
    bg.addEventListener('click', (e) => {
        console.log('hoa');

        let bgImg = bg.querySelector('img');

        console.log(bgImg);

        axios.post('/copytopublic', { path: `public/files/df-bgs/${bgImg.src.split('df-bgs/')[1]}`, filename: bgImg.src.split('df-bgs/')[1], type: 'backgrounds' }).then(rsp => {
            console.log(rsp.data);
            bgIMGNAME = bgImg.src.split('df-bgs/')[1];
            closeBgBtn.click();
        });
    });
})

openBGListBtn.addEventListener('click', (e) => {
    BGListContainer.classList.add('Home__bg-image_list_container');
    BGListContainer.classList.remove('Home__bg-image_list_container_hidden');

    BGList.classList.add('Home__bg-image_list');
    BGList.classList.remove('Home__bg-image_list_hidden');
});

closeBgBtn.addEventListener('click', (e) => {
    BGListContainer.classList.remove('Home__bg-image_list_container');
    BGListContainer.classList.add('Home__bg-image_list_container_hidden');

    BGList.classList.remove('Home__bg-image_list');
    BGList.classList.add('Home__bg-image_list_hidden');
});