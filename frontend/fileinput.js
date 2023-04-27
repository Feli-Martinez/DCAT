const FileInput = document.querySelector("#upload-zip");
const FileInputLabelContainer = document.querySelector('.FileInput__upload-zip_label_container');
const FileInputLabel = document.querySelector('.FileInput__upload-zip_label');
let clicked = false;
let FL;

FileInputLabel.addEventListener('click', (e) => {
    e.preventDefault();
});

FileInputLabelContainer.addEventListener('click', (e) => {
    FileInput.click();
});

FileInput.addEventListener('change', (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(FileInput.files[0]);

    reader.addEventListener('load', (ev) => {
        const data = ev.target.result;
        const filename = FileInput.files[0].name;
        FL = JSON.stringify(filename);

        clicked = true;

        axios.post("/file",
            {
                "filename": filename,
                "data": data
            }
        ).then(res => {
            alert(res.data.message);

            setTimeout(() => {
                const FileInputtt = document.querySelector('.FileInput');
                const btnn = document.querySelector('.Home__help_btn');

                FileInputtt.remove();
                btnn.remove();
                
                reqDataUris(FL.replace('.zip', ''), 'public/files/extracted/');
            }, 450);
        });
    });
});