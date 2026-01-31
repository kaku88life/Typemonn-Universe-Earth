#!/usr/bin/env node

/**
 * Notion Sync Script for Type-Moon Holograph Project
 * 自動將項目進度日誌同步到 Notion Database
 *
 * 使用方式：
 * 1. npm run notion:sync        (手動執行一次)
 * 2. npm run notion:schedule    (啟動定時任務)
 */

const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config({ path: '.env.notion' });

// ============================================================================
// 配置
// ============================================================================

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
const PROJECT_LOG_FILE = process.env.PROJECT_LOG_FILE || './PROJECT_PROGRESS_LOG.md';
const SYNC_SCHEDULE = process.env.SYNC_SCHEDULE || '0 9 * * 1'; // 預設每週一 09:00

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ 缺少必要的環境變量：NOTION_API_KEY 或 NOTION_DATABASE_ID');
  console.error('請在 .env.notion 中填入你的憑證');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });

// ============================================================================
// 工具函數
// ============================================================================

/**
 * 讀取 Markdown 文件並提取內容
 */
function readProjectLog() {
  try {
    const content = fs.readFileSync(PROJECT_LOG_FILE, 'utf-8');
    return content;
  } catch (error) {
    console.error(`❌ 無法讀取文件: ${PROJECT_LOG_FILE}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * 將 Markdown 內容分解為結構化數據
 */
function parseMarkdown(content) {
  const lines = content.split('\n');
  const data = {
    title: '項目進度日誌',
    date: new Date().toISOString().split('T')[0],
    status: '進行中',
    sections: []
  };

  let currentSection = null;
  let sectionContent = [];

  for (const line of lines) {
    // 提取標題
    if (line.startsWith('# ')) {
      data.title = line.replace('# ', '').trim();
    }
    // 提取日期
    if (line.includes('📅 日期：')) {
      const dateMatch = line.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
      if (dateMatch) {
        const year = dateMatch[1];
        const month = String(dateMatch[2]).padStart(2, '0');
        const day = String(dateMatch[3]).padStart(2, '0');
        data.date = `${year}-${month}-${day}`; // 轉換為 ISO 8601 格式
      }
    }
    // 提取部分
    if (line.startsWith('## ')) {
      if (currentSection) {
        data.sections.push({
          title: currentSection,
          content: sectionContent.join('\n').trim()
        });
      }
      currentSection = line.replace('## ', '').trim();
      sectionContent = [];
    } else if (currentSection) {
      sectionContent.push(line);
    }
  }

  // 追加最後一個部分
  if (currentSection) {
    data.sections.push({
      title: currentSection,
      content: sectionContent.join('\n').trim()
    });
  }

  return data;
}

/**
 * 將文本轉換為 Notion Block 格式
 */
function textToNotionBlocks(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const blocks = [];

  for (const line of lines) {
    if (line.startsWith('- ')) {
      // 清單項目
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: line.substring(2).trim() } }]
        }
      });
    } else if (line.startsWith('| ')) {
      // 表格（Notion 不直接支持，用程式碼塊）
      blocks.push({
        object: 'block',
        type: 'code',
        code: {
          rich_text: [{ type: 'text', text: { content: line } }],
          language: 'plain text'  // 使用 Notion 支持的語言名稱
        }
      });
    } else if (line.trim()) {
      // 一般段落
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: line.trim() } }]
        }
      });
    }
  }

  return blocks;
}

/**
 * 在 Notion Database 中建立或更新頁面
 */
async function syncToNotion(data) {
  try {
    console.log('🔄 正在同步到 Notion...');

    // 建立新頁面（使用最小化屬性）
    console.log('✨ 建立新頁面...');

    let pageId;
    try {
      // 首先嘗試獲取 Database schema 以瞭解可用屬性
      const dbResponse = await notion.databases.retrieve({
        database_id: NOTION_DATABASE_ID
      });

      // 只使用 Database 中實際存在的屬性
      const properties = {};
      const availableProps = Object.keys(dbResponse.properties);

      // 檢查是否有名稱類屬性（通常是 Name 或 Title）
      const titleProp = availableProps.find(p =>
        p.toLowerCase() === 'name' ||
        p.toLowerCase() === 'title' ||
        dbResponse.properties[p].type === 'title'
      );

      if (titleProp) {
        properties[titleProp] = {
          title: [
            {
              type: 'text',
              text: { content: `${data.title} (${data.date})` }
            }
          ]
        };
      }

      const createResponse = await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID
        },
        properties: titleProp ? properties : {}
      });

      pageId = createResponse.id;
    } catch (error) {
      // 如果上面的方式失敗，使用最基本的建立方式
      const createResponse = await notion.pages.create({
        parent: {
          database_id: NOTION_DATABASE_ID
        },
        properties: {}
      });
      pageId = createResponse.id;
    }

    // 添加內容塊
    let blockIndex = 0;
    for (const section of data.sections) {
      const blocks = textToNotionBlocks(section.content);

      // 先添加章節標題
      blocks.unshift({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [{ type: 'text', text: { content: section.title } }]
        }
      });

      // 分批添加塊（Notion API 限制）
      const batchSize = 100;
      for (let i = 0; i < blocks.length; i += batchSize) {
        const batch = blocks.slice(i, i + batchSize);

        try {
          await notion.blocks.children.append({
            block_id: pageId,
            children: batch
          });
        } catch (error) {
          console.error(`⚠️ 添加塊時出錯: ${error.message}`);
        }

        blockIndex += batch.length;
      }
    }

    console.log(`✅ 同步成功！共添加 ${blockIndex} 個內容塊`);
    return pageId;

  } catch (error) {
    console.error('❌ Notion 同步失敗：');
    console.error(error.message);

    if (error.code === 'unauthorized') {
      console.error('💡 提示：檢查 NOTION_API_KEY 是否正確');
    } else if (error.code === 'invalid_request_url') {
      console.error('💡 提示：檢查 NOTION_DATABASE_ID 是否正確');
    }

    process.exit(1);
  }
}

/**
 * 主同步函數
 */
async function main() {
  console.log('\n🚀 Type-Moon Holograph - Notion 同步啟動\n');
  console.log(`📂 讀取文件: ${PROJECT_LOG_FILE}`);

  const content = readProjectLog();
  const data = parseMarkdown(content);

  console.log(`📋 項目標題: ${data.title}`);
  console.log(`📅 日期: ${data.date}`);
  console.log(`📊 章節數: ${data.sections.length}\n`);

  await syncToNotion(data);
}

/**
 * 啟動定時任務
 */
function startScheduler() {
  console.log('\n⏰ Notion 同步定時任務已啟動\n');
  console.log(`📅 同步時間表: ${SYNC_SCHEDULE}`);
  console.log('   (輸入 Ctrl+C 停止)\n');

  cron.schedule(SYNC_SCHEDULE, async () => {
    console.log(`\n[${new Date().toLocaleString('zh-TW')}] 執行定時同步...`);
    await main().catch(error => {
      console.error('定時任務執行出錯:', error);
    });
  });

  // 首次立即執行
  console.log('📤 首次立即執行同步...\n');
  main().catch(error => {
    console.error('初始同步失敗:', error);
    process.exit(1);
  });
}

// ============================================================================
// 命令行界面
// ============================================================================

const command = process.argv[2];

if (command === '--schedule') {
  startScheduler();
  // 保持進程活動
  setInterval(() => {}, 1000);
} else {
  // 預設：執行一次同步
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}
