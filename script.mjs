import deletePost from "./modules/deletePost.mjs"
import patchData from "./modules/patchData.mjs"
let time = new Date();
const getData = url =>
    new Promise((resolve, reject) =>
        fetch(url)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(error => reject(error))
    )

const container = document.querySelector('.container')
getData('http://localhost:3000/POSTS')
    .then(data => {
        data.forEach(element => {
            container.insertAdjacentHTML(
                `afterbegin`,
                `<div class="post">
                    <i class="fa-solid fa-trash delete"></i>
                    <div class="text">${element.text}</div>
                    <div class="time">${element.date}</div>
                    <div class="grades">
                        <div class="likes"><i class="fa-solid fa-thumbs-up"></i> ${element.likes}</div>
                        <div class="dislikes"><i class="fa-solid fa-thumbs-down"></i> ${element.dislikes}</div>
                    </div>
                    <div class="newComment">
                        <input type="text" class="newCommentInput">
                        <div class="newCommentButton"><i class="fa-solid fa-paper-plane"></i></div>
                    </div>
                    <div class="commentsField"></div>
                    <div class="id">${element.id}</div>
                </div>`
            )
            const commentsField = document.querySelector('.commentsField');
            element.comments.forEach((elem) => {
                commentsField.insertAdjacentHTML(`afterbegin`, `
                    <div class="comment">
                        <i class="fa-solid fa-pen editComBut"></i>
                        <div class="timeCom">${elem.date}</div>
                        <span class="comText">${elem.text}</span>
                        <div class="editComBox">
                            <input type="text" class="editCom">
                            <div class="editComApply"><i class="fa-solid fa-check"></i></div>
                        </div>
                        <div class="comId">${elem.id}</div>
                    </div>
                `)
                const editComBut = document.querySelector('.editComBut');
                const comText = document.querySelector('.comText');
                const editComBox = document.querySelector('.editComBox');
                const editCom = document.querySelector('.editCom');
                const editComApply = document.querySelector('.editComApply');
                editComBut.addEventListener('click', () => {
                    comText.style.display = 'none';
                    editComBox.style.display = 'flex';
                    editCom.value = elem.text;
                })
                editComApply.addEventListener('click', async() => {
                    comText.style.display = 'flex';
                    editComBox.style.display = 'none';
                    let commentsArr = element.comments.map((el) => {
                        if(el.id == elem.id){
                            el.text = editCom.value;
                            el.edited = true;
                            el.editedDate = `${time.getDate()}.${time.getMonth()}.${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}`;
                            return el;
                        }
                        else{
                            return el;
                        }
                    })
                    console.log(commentsArr)
                    try {
                        await patchData('http://localhost:3000/POSTS', element.id, { comments: commentsArr})
                        .then(response => console.log(response, 'данные успешно обновлены'));
                    } 
                    catch (error) {
                        console.error(error);
                    }
                })
                const timeCom = document.querySelector('.timeCom');
                if(elem.edited){
                    timeCom.innerText = `${timeCom.innerText}, ред. ${elem.editedDate}`
                }
            })
            const deleteBut = document.querySelector('.delete');
            deleteBut.addEventListener('click', async() => {
                console.log('done')
                try {
                    await deletePost('http://localhost:3000/POSTS', element.id)
                    .then(response => console.log(response));
                } 
                catch (error) {
                    console.error(error);
                }
            })
            const likeBut = document.querySelector('.likes');
            likeBut.addEventListener('click', async() => {
                try {
                    const updatedProductData = { likes: element.likes + 1 };
                    console.log(element.id)
                    await patchData('http://localhost:3000/POSTS', element.id, updatedProductData)
                    .then(response => console.log(response, 'данные успешно обновлены'));
                } 
                catch (error) {
                    console.error(error);
                }
            })
            const dislikeBut = document.querySelector('.dislikes');
            dislikeBut.addEventListener('click', async() => {
                try {
                    const updatedProductData = { dislikes: element.dislikes + 1 };
                    console.log(element.id)
                    await patchData('http://localhost:3000/POSTS', element.id, updatedProductData)
                    .then(response => console.log(response, 'данные успешно обновлены'));
                } 
                catch (error) {
                    console.error(error);
                }
            })
            const addCom = document.querySelector('.newCommentButton');
            const newCommentInput = document.querySelector('.newCommentInput');
            addCom.addEventListener('click', async() => {
                try {
                    let commentsArr = element.comments
                    if(commentsArr.length != 0 && newCommentInput.value != ""){
                        commentsArr.push({
                            "text": newCommentInput.value,
                            "date": `${time.getDate()}.${time.getMonth()}.${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}`,
                            "edited": false,
                            "editedDate": "",
                            "id": commentsArr[commentsArr.length - 1].id + 1
                        });
                    }
                    else if(newCommentInput.value != ""){
                        commentsArr = [{
                            "text": newCommentInput.value,
                            "date": `${time.getDate()}.${time.getMonth()}.${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}`,
                            "edited": false,
                            "editedDate": "",
                            "id": 0
                        }];
                    }
                    await patchData('http://localhost:3000/POSTS', element.id, { comments: commentsArr})
                    .then(response => console.log(response, 'данные успешно обновлены'));
                } 
                catch (error) {
                    console.error(error);
                }
            })
        })
    })
    .catch(error => console.error(error))
