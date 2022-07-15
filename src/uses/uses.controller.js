const uses = require("../data/uses-data")

// middleware function for checking if url already exists
function useExists(req, res, next) {
    const { useId } = req.params
    const foundUse = uses.find((use) => use.id === Number(useId))
       if (foundUse) {
        res.locals.use = foundUse
        return next()
    }
       next({
        status: 404,
        message: `Use id not found: ${useId}`
    })
}

// function for making a get request to list all uses data
function list(req, res) {
  res.status(200).json({data: uses})
}


// function for making a delete request of a use
function destroy(req, res) {
    const { useId } = req.params
    const index = uses.find((use) => {
        use.id === Number(useId)
    })
      if (index > -1) {
        uses.splice(index, 1)
    }
      res.sendStatus(204)
}

// function for making a get request to a specific use
function read(req, res, next) {
    res.json({ data: res.locals.use })
}


module.exports = {
    list,
    read: [useExists, read],
    delete: [useExists, destroy],
  }