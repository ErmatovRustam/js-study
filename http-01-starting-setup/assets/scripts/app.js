const posts = document.querySelector('.posts')
const eachPost = document.getElementById('single-post')
const form = document.querySelector('#new-post form')
const fetchBtn = document.querySelector('#available-posts button')
const list = document.querySelector('ul')


// function sendRequest(method, url, data) {
//   const promise = new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest()
//     xhr.setRequestHeader('Content-Type', 'application/json')


//     xhr.open(method, url)
//     // we send request and now we have to wait. We have wait for load event
//     xhr.responseType = 'json'

//     xhr.onload = function () {
//       if (xhr.status >= 200 && xhr.status <=  300) {
//         resolve(xhr.response)
//       } else {
//         reject(new Error('Something went wrong'))
//       }
//     }
//     xhr.onerror = function () {
//       reject('Failed')
//     }
//     xhr.send(JSON.stringify(data))
//   })

//   return promise
// }

function sendRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    header: {
      'Content-type': 'application/json'
    }
  }).then(res => {
    if (res.status >= 200 && res.status <= 300) {
      return res.json();
    } else {
      res.json().then(err => {
        throw new Error('FAILED on SERVER')
      })
    }
  })
}


async function fetchP() {
  try {
    const resData = await sendRequest(
      'GET',
      'https://jsonplaceholder.typicode.com/post'
    )
    const res = resData
    for (const el of res) {
      const poEl = document.importNode(eachPost.content, true)
      poEl.querySelector('h2').textContent = el.title
      poEl.querySelector('p').textContent = el.body
      poEl.querySelector('li').id = el.id
      posts.appendChild(poEl)
    }
  } catch (error) {
    alert(error.message)
  }
}

async function createP(title, content) {
  const userId = Math.random()
  const newPost = {
    title: title,
    body: content,
    userId: userId,
  }

  await sendRequest(
    'POST',
    'https://jsonplaceholder.typicode.com/posts',
    newPost
  )
}

fetchBtn.addEventListener('click', fetchP)
form.addEventListener('submit', (event) => {
  event.preventDefault()
  const title = event.currentTarget.querySelector('#title').value
  const content = event.currentTarget.querySelector('#content').value
  createP(title, content)
})

list.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const id = event.target.closest('li').id
    sendRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${id}`)
  }
})
