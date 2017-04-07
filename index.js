#!/usr/bin/env node

const git = require('./git')
const inquirer = require('inquirer')
const meow = require('meow')
const pkg = require('./package.json')
const updateNotifier = require('update-notifier')

updateNotifier({ pkg })
  .notify({ defer: false })

const cli = meow(
  `
    Usage
      $ change-branch

    Options
      -a, --all   Show all branches, even remotes
      -h, --help  Display this help and exit
  `,
  {
    alias: {
      a: 'all',
      h: 'help',
    },
  }
)

const remotesRegex = /^remotes\//

const getChoices = branches => {
  if (cli.flags.all) {
    return branches.map(branch => branch.replace(remotesRegex, ''))
  }

  return branches.filter(branch => !branch.match(remotesRegex))
}

const repo = git.openRepo()

repo.getBranches(repo)
  .then(result => {
    const choices = getChoices(result.all)
    const currentIndex = choices.indexOf(result.current)
    const defaultChoice = Math.max(currentIndex, 0)

    return inquirer.prompt([{
      choices,
      default: defaultChoice,
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
