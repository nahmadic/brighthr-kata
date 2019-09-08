"use strict";

let fileList = [];

const loadJson = () => {
  document.querySelector('.documents-container').innerHTML = ""

  fetch("./documents.json")
    .then((resp) => resp.json())
    .then((data) => {
      fileList = [...data]
      loadOutput(fileList)
    })
    .catch((err) => console.log(`Error fetching JSON file - ${err}`))
}

const sortOutput = () => {
  document.querySelector('.documents-container').innerHTML = ""

  const currentOption = document.getElementById('document-sort').value
  // I had a plan to flatten the array here, retrieving the array from inside
  // the folder object but I simply didn't have time to make it work - sorry
  const sortedFileList = fileList.sort((a, b) => {
    let valueA = a[currentOption]
    let valueB = b[currentOption]

    if (valueA > valueB) {
      return 1
    }

    if (valueB > valueA) {
      return -1
    }

    return 0
  })

  loadOutput(sortedFileList)
}

const searchOutput = () => {
  const searchValue = document.getElementById('document-search').value

  if (searchValue != "") {
    document.querySelector('.documents-container').innerHTML = ""

    const searchedFileList = fileList.filter(file => file.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1)

    if (searchedFileList.length > 0) {
      loadOutput(searchedFileList)
    } else {
      document.querySelector('.documents-container').innerHTML += `<h2>No results found, sorry</h2>`
    }

  } else {
    document.querySelector('.documents-container').innerHTML = ""
    loadOutput(fileList)
  }
}

const loadOutput = (files) => {
  if (files.length) {
    files.forEach(file => {
      if (file.type == 'folder') {
        const output = buildFolder(file)
        if (output) {
          document.querySelector('.documents-container').innerHTML += output
        }
      } else {
        const output = buildFile(file)
        if (output) {
          document.querySelector('.documents-container').innerHTML += output
        }
      }
    })
  }
}

const buildFolder = (folder) => {
  const {type, name, files} = folder
  const folderOutput = `
    <div class="folder">
      <div class="folder__header">
        <div class="icon icon--${type}"></div>
        <div class="title"><h2>${name}</h2></div>
        <div class="icon icon--arrow"></div>
      </div>
      <div class="folder__content">
        ${files.map(file => buildFile(file)).join('')}
      </div>
    </div>
  `
  return folderOutput
}

const buildFile = (file) => {
  const {type, name, added} = file
  const output = `
    <div class="document">
      <div class="icon icon--${type}"></div>
      <div class="title"><h2>${name}</h2></div>
      <div class="date"><h3>${added}</h3></div>
    </div>
  `
  return output
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('folder__header')) {
    if (e.target.parentElement.classList.contains('open')) {
      e.target.parentElement.classList.remove('open')
    } else {
      e.target.parentElement.classList.add('open')
    }
  }
}, true)

document.addEventListener('DOMContentLoaded', loadJson)
document.getElementById('document-sort').addEventListener('change', sortOutput)
document.getElementById('search-submit').addEventListener('click', searchOutput)