import jsonfile from 'jsonfile'
import moment from 'moment'
import simpleGit from 'simple-git'
import random from 'random'
import chalk from 'chalk'

const DATA_PATH = './data.json'
const AUTHOR_EMAIL = 'tesaccx9@gmail.com'
const git = simpleGit()

const display = (msg, type = 'info') => {
  const time = moment().format('HH:mm')
  const color = {
    info: chalk.blue,
    success: chalk.green,
    error: chalk.red
  }
  console.log(`${chalk.gray(`[ ${time} ]`)} ${color[type](msg)}`)
}

const randomDate = () => {
  const startDate = moment('2008-01-01')
  const endDate = moment()
  return moment(startDate).add(random.int(0, endDate.diff(startDate, 'days')), 'days').format()
}

const commitOnce = async (n) => {
  try {
    const date = randomDate()
    const data = {
      date: date,
      commit: {
        message: `Commit #${n} - ${date}`,
        author: AUTHOR_EMAIL,
        branch: 'main'
      }
    }

    await jsonfile.writeFile(DATA_PATH, data)
    await git.add(DATA_PATH)
    await git.commit(data.commit.message, { '--date': date })
    display(`[ #${n} ] Commit Berhasil!!`, 'success')
    return true
  } catch (e) {
    display(`[ #${n} ] Commit Gagal!!`, 'error')
    return false
  }
}

const main = async () => {
  let count = 1
  while (true) {
    const success = await commitOnce(count)
    if (success) {
      await git.push()
      count++
    }
  }
}

main().catch(e => display(`ERROR: ${e}`, 'error'))
