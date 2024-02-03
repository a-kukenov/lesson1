const postData = (url, product) => {
    return new Promise((resolve, reject) =>
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
      })
        .then(response => response.json())
        .then(json => resolve(json))
        .catch(error => reject(error))
    )
}
export default postData