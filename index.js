#!/usr/bin/env node

const git = require('./git')
const inquirer = require('inquirer')
const meow = require('meow')

const cli = meow(
  `
    Usage
      $ change-branch

    Options
      -h, --help  Display this help and exit
  `,
  {
    alias: {
      h: 'help',
    },
  }
)

const repo = git.openRepo()

repo.getBranches(repo)
  .then(result => {
    return inquirer.prompt([{
      choices: result.all,
      default: result.all.indexOf(result.current),
      message: 'Choose a branch',
      name: 'branch',
      type: 'list',
    }])
  })
  .then(({ branch }) => {
    return repo.checkout(branch)
  })
  .catch(error => {
    console.error('An error occured')
    console.error(error)
    process.exit(1)
  })
