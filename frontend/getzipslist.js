const HomeHelpContainer = document.querySelector('#help_container');
const HomeHelp = document.querySelector('#help');
const closeBtn = document.querySelector('.Home__help_close');
const helpBtn = document.querySelector('.Home__help_btn');
let zipsList = [];

closeBtn.addEventListener('click', (e) => {
    HomeHelp.classList.add('Home__help_hidden');
    HomeHelp.classList.remove('Home__help');

    HomeHelpContainer.classList.add('Home__help_container_hidden');
    HomeHelpContainer.classList.remove('Home__help_container');
});

helpBtn.addEventListener('click', (e) => {
    if(zipsList.length == 0){
        axios.get('/listzips').then(res => {
            zipsList = res.data.displayNames;

            HomeHelpContainer.classList.remove('Home__help_container_hidden');
            HomeHelpContainer.classList.add('Home__help_container');

            setTimeout(() => {
                HomeHelp.classList.remove('Home__help_hidden');
                HomeHelp.classList.add('Home__help');

                pushIntoList();
            }, 300);
        });
    }
    else{
        HomeHelpContainer.classList.remove('Home__help_container_hidden');
        HomeHelpContainer.classList.add('Home__help_container');

        setTimeout(() => {
            HomeHelp.classList.remove('Home__help_hidden');
            HomeHelp.classList.add('Home__help');

            pushIntoList();
        }, 300);
    }
});