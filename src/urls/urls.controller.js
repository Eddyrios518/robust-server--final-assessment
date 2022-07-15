// urls required to access the data files
const path = require("path")
const urls = require(path.resolve("src/data/urls-data"))
const uses = require(path.resolve("src/data/uses-data"))

function create(req, res) {
    const { data: { href } = {} } = req.body
    const newUrl = {
        href,
        id: urls.length + 1
    }
    urls.push(newUrl)
    res.status(201).json({ data: newUrl })
}
 // middleware function for checking if url has 
// an href value before moving to create()
function hasHref(req, res, next) {
    const { data: { href } = {} } = req.body
       if (href) {
         return next()
    }
         next({
          status: 400, 
          message: "An 'href' property is required." 
        })
  }

  // middleware for checking if url already exists
  function urlExists(req, res, next) {
    const urlId = Number(req.params.urlId)
    const foundUrl = urls.find((url) => 
        url.id === urlId)
        if (foundUrl) {
         res.locals.url = foundUrl
           return next()
    }
      next({
      status: 404,
      message: `Url id not found: ${req.params.urlId}`
    })
  }

function update(req, res, next) {
    const foundUrl = res.locals.url
    const { data: { href } = {} } = req.body
    foundUrl.href = href
     res.json({ data: foundUrl })
}

function read(req, res, next) {
    res.json({ data: res.locals.url})
    next()
}

function addUse(req, res) {
    const newUse = {
        id: uses.length + 1,
        urlId: Number(req.params.urlId),
        time: Date.now()
    }
    uses.push(newUse)
    res.status(201).json({ data: newUse })
}

 function list(req, res) {
     res.json({ data: urls })
 }

module.exports = {
    create: [hasHref, create],
    list,
    read: [urlExists, read, addUse],
    update: [urlExists, update],
    urlExists,
  }