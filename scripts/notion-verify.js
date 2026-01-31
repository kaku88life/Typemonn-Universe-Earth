#!/usr/bin/env node

/**
 * Notion Configuration Verification Script
 * 驗證 Notion 同步配置是否正確
 *
 * 使用方式：npm run notion:verify
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.notion' });

console.log('\n🔍 Notion 配置驗證\n');

const checks = [];

// 檢查 1: .env.notion 文件存在
const envExists = fs.existsSync('.env.notion');
checks.push({
  name: '.env.notion 文件存在',
  passed: envExists,
  hint: envExists ? '✅' : '❌ 請建立 .env.notion 文件'
});

// 檢查 2: NOTION_API_KEY
const apiKey = process.env.NOTION_API_KEY;
const apiKeyValid = apiKey && apiKey !== 'your_api_key_here' && (apiKey.startsWith('secret_') || apiKey.startsWith('ntn_'));
checks.push({
  name: 'NOTION_API_KEY 已配置',
  passed: apiKeyValid,
  hint: apiKey ? `✅ (${apiKey.slice(0, 10)}...)` : '❌ 缺失或佔位符',
  detail: '應是 Notion Integration Token（以 secret_ 或 ntn_ 開頭）'
});

// 檢查 3: NOTION_DATABASE_ID
const dbId = process.env.NOTION_DATABASE_ID;
const dbIdValid = dbId && dbId !== 'your_database_id_here' && dbId.length === 32;
checks.push({
  name: 'NOTION_DATABASE_ID 已配置',
  passed: dbIdValid,
  hint: dbId ? `✅ (${dbId.slice(0, 8)}...)` : '❌ 缺失或佔位符',
  detail: '應是 32 字符的 UUID（無連字符）'
});

// 檢查 4: PROJECT_LOG_FILE 存在
const logFile = process.env.PROJECT_LOG_FILE || './PROJECT_PROGRESS_LOG.md';
const logFileExists = fs.existsSync(logFile);
checks.push({
  name: `日誌文件存在 (${logFile})`,
  passed: logFileExists,
  hint: logFileExists ? '✅' : `❌ 文件不存在: ${logFile}`,
  detail: '確保路徑正確'
});

// 檢查 5: SYNC_SCHEDULE 格式
const schedule = process.env.SYNC_SCHEDULE || '0 9 * * 1';
const scheduleValid = /^(\d+|\*) (\d+|\*) (\d+|\*|\*\/\d+) (\d+|\*) (\d+|\*|\*-\d+|\d+-\d+)$/.test(schedule);
checks.push({
  name: 'SYNC_SCHEDULE 格式正確',
  passed: scheduleValid,
  hint: scheduleValid ? `✅ (${schedule})` : `❌ 無效的 Cron 表達式: ${schedule}`,
  detail: '格式: 秒 分 時 日 月 周'
});

// 檢查 6: 必要的 npm 依賴
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const hasDeps =
  packageJson.dependencies['@notionhq/client'] &&
  packageJson.dependencies['node-cron'] &&
  packageJson.dependencies['dotenv'];

checks.push({
  name: '必要的 npm 依賴已安裝',
  passed: hasDeps,
  hint: hasDeps ? '✅' : '❌ 缺少依賴，請執行 npm install',
  detail: '@notionhq/client, node-cron, dotenv'
});

// 檢查 7: npm 腳本已配置
const hasScripts = packageJson.scripts['notion:sync'] && packageJson.scripts['notion:schedule'];
checks.push({
  name: 'npm 腳本已配置',
  passed: hasScripts,
  hint: hasScripts ? '✅' : '❌ 缺少 notion:sync 和 notion:schedule 腳本',
  detail: '在 package.json 中配置'
});

// 顯示結果
console.log('📋 驗證結果：\n');

let allPassed = true;
checks.forEach((check, index) => {
  const icon = check.passed ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
  if (check.hint) {
    console.log(`   ${check.hint}`);
  }
  if (check.detail) {
    console.log(`   💡 ${check.detail}`);
  }
  console.log();
  if (!check.passed) allPassed = false;
});

// 顯示摘要
console.log('─'.repeat(50));
const passedCount = checks.filter(c => c.passed).length;
const totalCount = checks.length;
console.log(`\n📊 摘要: ${passedCount}/${totalCount} 檢查通過\n`);

if (allPassed) {
  console.log('🎉 所有配置檢查通過！');
  console.log('\n接下來：');
  console.log('  1. 執行一次同步：npm run notion:sync');
  console.log('  2. 啟動定時任務：npm run notion:schedule\n');
  process.exit(0);
} else {
  console.log('⚠️  部分配置缺失或不正確');
  console.log('\n請按照上述提示修正，然後重新執行此驗證。');
  console.log('查看詳情：cat NOTION_SYNC_GUIDE.md\n');
  process.exit(1);
}
