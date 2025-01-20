import fs from 'fs'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = query => new Promise(resolve => rl.question(query, resolve))

let flattenedData = {}

function flattenObject(obj, prefix = '') {
  for (const key in obj) {
    if (key.includes('_element') || key.includes('_name')) {
      continue
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], prefix + key + '.')
    } else {
      const fullKey = prefix + key
      if (!fullKey.includes('_element') && !fullKey.includes('_name')) {
        flattenedData[fullKey] = obj[key].toString()
      }
    }
  }
}

async function main() {
  try {
    // 获取并验证语言
    const locale =
      (await question('请输入语言（zh-CN/en，默认zh-CN）: ')) || 'zh-CN'
    if (!['zh-CN', 'en'].includes(locale)) {
      throw new Error('语言必须是 zh-CN 或 en')
    }

    // 获取并验证目录
    const directory =
      (await question('请输入目录路径（默认src/locales）: ')) || 'src/locales'
    if (!fs.existsSync(`./${directory}`)) {
      throw new Error(`目录 ${directory} 不存在`)
    }

    // 新增：选择 i18n_module
    // idPrefix
    const modules = [
      'Platform',
      'Tickets',
      'Safety',
      'Equipment',
      'Workorder',
      'Examination',
      'Shiftduty',
      'Inspection',
      'Material',
      'Assess',
      'Calculation',
      'Supervision',
      'Engineering',
      'Eqeval',
      'External',
      'Datapush',
      'Portalsite'
    ]
    console.log('\n可选的模块：')
    modules.forEach((module, index) => {
      console.log(`${index + 1}. ${module}(${100 + index + 1})`)
    })

    const moduleChoice = (await question('\n请选择模块编号（默认1）: ')) || '1'
    const moduleIndex = parseInt(moduleChoice) - 1
    if (
      isNaN(moduleIndex) ||
      moduleIndex < 0 ||
      moduleIndex >= modules.length
    ) {
      throw new Error('无效的模块选择')
    }
    const selectedModule = modules[moduleIndex]
    let idPrefix = 100 + parseInt(moduleChoice)

    const filePath = `./${directory}/${locale}.json`
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件 ${filePath} 不存在`)
    }

    // 读取JSON文件
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))

    // 生成SQL
    function generateSQL() {
      flattenedData = {} // 重置flattenedData
      flattenObject(jsonData)

      let sql = `INSERT INTO cpis_i18n (
        id,
        i18n_locale,
        i18n_key, 
        i18n_default_value,
        i18n_module,
        create_user,
        create_user_id,
        create_time,
        update_user,
        update_user_id,
        update_time
    ) VALUES\n`

      let values = []
      let id = parseInt(
        idPrefix + (locale === 'zh-CN' ? '01' : '02') + '00000000'
      )

      for (const [key, value] of Object.entries(flattenedData)) {
        const escapedValue = value.replace(/'/g, "''")
        values.push(
          `(${id}, '${locale}', '${key}', '${escapedValue}', '${selectedModule}', '管理员', 1, NOW(), '管理员', 1, NOW())`
        )
        id++
      }

      sql += values.join(',\n')
      sql += ';'

      return sql
    }

    // 生成SQL并写入文件
    const sql = generateSQL()
    fs.writeFileSync('output.sql', sql, 'utf8')

    console.log('SQL生成完成，已写入output.sql文件')
  } catch (error) {
    console.error('错误：', error.message)
  } finally {
    rl.close()
  }
}

main()
