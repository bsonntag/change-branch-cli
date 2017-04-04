const simpleGit = require('simple-git')

const openRepo = () => {
  const repo = simpleGit()

  const getBranches = () => {
    return new Promise((resolve, reject) => {
      repo.branch((error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
  }

  const checkout = branch => {
    return new Promise((resolve, reject) => {
      repo.checkout(branch, (error, result) => {
        if (error) reject(error)
        else resolve(result)
      })
    })
  }

  return {
    checkout,
    getBranches,
  }
}

module.exports = { openRepo }
