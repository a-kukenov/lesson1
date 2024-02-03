const deletePost = (url, productId) => {
    return new Promise((resolve, reject) =>
      fetch(`${url}/${productId}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            resolve('Данные успешно удалены');
          } else {
            reject('Ошибка удаления данных');
          }
        })
        .catch(error => reject(error))
    );
}
export default deletePost