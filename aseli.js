import jsonfile from 'jsonfile'
import moment from 'moment'
import simpleGit from 'simple-git'
import random from 'random'
import chalk from 'chalk'

const DATA_PATH = './data.json'
const AUTHOR_EMAIL = 'tesaccx9@gmail.com'
const git = simpleGit()

const timeLog = () => chalk.gray(`[ ${moment().format('HH:mm')} ]`)

const successLog = () => console.log(`${timeLog()} ${chalk.green('Sukses add!!')}`)
const failLog = (msg) => {
  console.log(`${timeLog()} ${chalk.red('Gagal add!!')}`)
  console.log(chalk.red('>>>>>>'), msg)
}

const randomDate = () => {
  const start = moment('2008-01-01')
  const end = moment()
  return moment(start).add(random.int(0, end.diff(start, 'seconds')), 'seconds').toISOString()
}

const commitOnce = async () => {
  try {
    const date = randomDate()
    const data = {
      date: date,
      commit: {
        message: `Commit - ${date}`,
        author: AUTHOR_EMAIL,
        branch: 'main'
      }
    }

    await jsonfile.writeFile(DATA_PATH, data)
    await git.add(DATA_PATH)
    await git.commit(data.commit.message, { '--date': date })

    successLog()
    return true
  } catch (err) {
    failLog(err.message)
    return false
  }
}

const main = async () => {
  while (true) {
    const ok = await commitOnce()
    if (ok) await git.push()
  }
}

main().catch((e) => failLog(e.message))
