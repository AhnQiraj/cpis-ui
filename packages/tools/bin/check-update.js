import { execSync } from 'child_process'
import readline from 'readline'
import fs from 'fs'
import path from 'path'

// 内网包列表
const packagesToCheck = [
  '@cpis/cpis-ui',
  '@cpis/cupubase',
  '@cpis/platformbase',
  '@cpis/uno-preset',
  '@cpis/tools',
  '@cpis/prettier-config'
]

// 内网 registry 地址
const INTERNAL_REGISTRY = 'http://172.169.50.28:5000'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = query => new Promise(resolve => rl.question(query, resolve))

function getCurrentVersions() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'))
  return {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {})
  }
}

async function checkUpdates() {
  console.log('正在检查依赖更新...')
  let needsUpdate = false
  let updateCommands = []

  try {
    const currentVersions = getCurrentVersions()

    for (const pkg of packagesToCheck) {
      const currentVersion = (currentVersions[pkg] || '').replace(/[\^~]/, '')

      if (!currentVersion) {
        console.log('\x1b[33m%s\x1b[0m', `⚠️  警告：未找到 ${pkg} 的版本信息`)
        continue
      }
      // 检查是否使用 latest 标签
      if (currentVersion === 'latest') {
        console.log('\x1b[33m%s\x1b[0m', `⚠️  警告：${pkg} 使用了 latest 标签，建议指定具体版本号`)
        continue
      }

      try {
        // 使用内网 registry 检查最新版本
        const latestVersion = execSync(
          `npm view ${pkg} version --registry=${INTERNAL_REGISTRY}`,
          { timeout: 20 * 1000 } // 设置5秒超时
        )
          .toString()
          .trim()

        if (currentVersion !== latestVersion) {
          needsUpdate = true
          console.log('\x1b[33m%s\x1b[0m', '⚠️  警告！')
          console.log('\x1b[31m%s\x1b[0m', `${pkg} 需要更新：${currentVersion} → ${latestVersion}`)
          updateCommands.push(`pnpm update ${pkg}@${latestVersion} --registry=${INTERNAL_REGISTRY}`)
        } else {
          console.log(`✓ ${pkg} 已是最新版本：${currentVersion}`)
        }
      } catch (error) {
        console.log('\x1b[33m%s\x1b[0m', `⚠️  警告：检查 ${pkg} 更新失败，可能是网络问题`)
        continue
      }
    }

    if (needsUpdate) {
      console.log('\n可执行以下命令更新：')
      updateCommands.forEach(cmd => {
        console.log('\x1b[36m%s\x1b[0m', cmd)
      })

      const answer = await question('\n是否立即更新？(y/N) ')

      if (answer.toLowerCase() === 'y') {
        console.log('\n开始更新...')
        for (const cmd of updateCommands) {
          try {
            execSync(cmd, { stdio: 'inherit' })
          } catch (error) {
            console.log('\x1b[31m%s\x1b[0m', `执行 ${cmd} 失败`)
            throw error
          }
        }
        console.log('\x1b[32m%s\x1b[0m', '✓ 更新完成！')
      } else {
        console.log('\x1b[33m%s\x1b[0m', '⚠️ 已跳过更新，继续执行...')
      }
    }
  } catch (error) {
    console.log('\n\x1b[41m\x1b[37m 错误 \x1b[0m', '检查更新失败！')
    console.log('\x1b[31m%s\x1b[0m', `错误信息：${error.message}`)
    console.log('\x1b[31m%s\x1b[0m', '请检查：')
    console.log('1. 内网是否连接正常')
    console.log('2. Nexus 私服是否可访问')
    console.log(`3. 是否可以访问 ${INTERNAL_REGISTRY}\n`)
    process.exit(1)
  } finally {
    rl.close()
  }
}

checkUpdates()
