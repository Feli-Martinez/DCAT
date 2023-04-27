const searchInput = document.querySelector('.Help__dragonsearch');
const downloadList = document.querySelector('.Help__dragon_downloads_list');

const pushIntoList = () => {
    if(Array.from(downloadList.children).length > 0){
        Array.from(downloadList.children).forEach(link => {
            link.remove();
        });

        zipsList.forEach(dragon => {
            if(dragon.zip.includes(searchInput.value.toLowerCase()) || dragon.displayName.toLowerCase().includes(searchInput.value.toLowerCase())){
                // console.log(dragon);
                // console.log(searchInput.value);

                let link = document.createElement('a');
                /*link.href = `/files/list-zips/${dragon.zip}`;
                link.download = dragon.zip;*/
                link.innerHTML = dragon.displayName;

                link.addEventListener('click', (e) => {
                    axios.post('/copytopublic', { path: `public/files/list-zips/${dragon.zip}`, filename: dragon.zip, type: 'zip' }).then(res => {
                        // console.log(res.newPath);
                        closeBtn.click();

                        axios.post("/extractfile",
                        {
                            "filename": dragon.zip
                        }
                        ).then(res => {
                            alert(res.data.message);
                
                            setTimeout(() => {
                                // console.log(dragon.zip + ' -> ' + dragon.zip.replace('.zip', ''));
                                const FileInputtt = document.querySelector('.FileInput');
                                const btnn = document.querySelector('.Home__help_btn');

                                FileInputtt.remove();
                                btnn.remove();

                                reqDataUris(dragon.zip.replace('.zip', ''), 'public/files/extracted/');
                            }, 450);
                        });
                    })
                });

                downloadList.appendChild(link);
            }
        });
    }
    else{
        // console.log(searchInput.value);
        zipsList.forEach(dragon => {
            if(dragon.zip.includes(searchInput.value.toLowerCase()) || dragon.displayName.toLowerCase().includes(searchInput.value.toLowerCase())){
                /*console.log(dragon);
                console.log(searchInput.value);*/

                let link = document.createElement('a');
                /*link.href = `/files/list-zips/${dragon.zip}`;
                link.download = dragon.zip;*/
                link.innerHTML = dragon.displayName;

                link.addEventListener('click', (e) => {
                    axios.post('/copytopublic', { path: `public/files/list-zips/${dragon.zip}`, filename: dragon.zip, type: 'zip' }).then(res => {
                        // console.log(res.newPath);
                        closeBtn.click();

                        axios.post("/extractfile",
                        {
                            "filename": dragon.zip
                        }
                        ).then(res => {
                            alert(res.data.message);
                
                            setTimeout(() => {
                                // console.log(dragon.zip + ' -> ' + dragon.zip.replace('.zip', ''));
                                const FileInputtt = document.querySelector('.FileInput');
                                const btnn = document.querySelector('.Home__help_btn');

                                FileInputtt.remove();
                                btnn.remove();

                                reqDataUris(dragon.zip.replace('.zip', ''), 'public/files/extracted/');
                            }, 450);
                        });
                    })
                });

                downloadList.appendChild(link);
            }
        });
    }
}

searchInput.addEventListener('input', (e) => {
    pushIntoList();
});