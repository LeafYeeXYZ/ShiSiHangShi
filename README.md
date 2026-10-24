# 无限的十四行诗

**北京师范大学白鸽青协委托制作**

## 本地开发

项目使用 Vite+、React、Hono 和 Cloudflare Workers，新增诗句存储在 D1 的 `SONNET_DB` 中。

```sh
vp install
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars，设置 PASSWORD 管理员密码
vp run cf:types
vp run db:migrate:local
vp dev
```

`.dev.vars` 已被 Git 忽略。本地 D1 数据保存在 `.wrangler/state` 中，与线上数据库隔离。
访问 `/manage` 可以同步诗句、输入密码后添加或删除诗句。

## 接口

- `GET /api/verses`：公开读取新增诗句。
- `PUT /api/verses`：JSON 请求体包含 `password`、`content`、`author`。
- `DELETE /api/verses`：JSON 请求体包含 `password`、`uuid`，重复删除返回当前列表。

成功响应均为 `{ verses: [{ uuid, createdAt, content, author }] }`，`createdAt` 为毫秒时间戳。
密码错误返回 401；JSON 或字段错误返回 400；请求体超过 64 KiB 返回 413；
未配置管理员密码时写入返回 503，公开读取仍可使用。

### 限流与缓存

API 在解析请求体、密码验证和数据库访问之前限流。按 Cloudflare 提供的
`CF-Connecting-IP` 分组, 不信任 `X-Forwarded-For`; 缺少 IP 的请求共用一个限额。
`READ_RATE_LIMITER` 默认每分钟 200 次, `WRITE_RATE_LIMITER` 默认每分钟 20 次,
PUT/DELETE 共用写入限额, 密码错误也计数。超限返回 JSON 429 和 `Retry-After: 60`。
阈值在 `wrangler.jsonc` 的 `ratelimits` 中调整。计数是 Cloudflare 每个节点的近似限制,
不是全球严格配额; 校园网等共享出口会共用 IP 限额, 可按实际流量提高读取阈值。

公开 GET 列表使用 Cache API 缓存 300 秒, 响应以 `X-Cache: HIT/MISS` 标识。
每次读取先查询 D1 的单行版本号, 命中后无需扫描或传输完整诗句表。
迁移 `0002` 添加版本表及 INSERT/UPDATE/DELETE 触发器, 数据变更与版本更新同事务提交,
各节点下一次读取自动使用新缓存键。并发旧请求只能写入旧版本键, 不会污染新版本缓存。
直接通过 D1 修改诗句也会使缓存失效。缓存故障回退到 D1; 数据库故障仍返回 500。
浏览器、写入响应及错误响应保持 `Cache-Control: no-store`, 不缓存密码或管理操作。
部署前必须应用全部迁移, 现有部署脚本已包含此步骤, 不需要新建 KV 或 Redis。

`data/original.json` 中的初始诗句与 `data/migrate.json` 中的旧服务端诗句均由前端直接导入，
不写入 D1，也不出现在管理列表中；修改或删除这些诗句需编辑对应 JSON 文件。
`data/migrate.json` 是 2026-10-10 从旧公开接口
`https://sonnet-api.leafyee.xyz/api/verses` 下载的诗句数组，保留原有 `uuid` 和 `createdAt`。
前端同步新服务端数据时按 UUID 去重，避免旧接口与本地快照中的同一条诗句重复显示。
数据库迁移只创建表，D1 用于此后新增的诗句，无需操作旧 Deno KV 服务器。

## 字体

保留 Noto Serif SC 的字形。当前页面和静态诗句用字合并为一个 WOFF2 子集，
其余字符按 256 字一组切分，浏览器根据 `unicode-range` 按需加载。
字体使用 `font-display: swap`，先显示系统字体；保存诗文图片前等待字体加载完成。
输出文件名含内容哈希，可长期缓存。原始 TTF 保存在 `data/fonts`，不随网站发布。

修改静态诗句或页面文案后，可以安装 [uv](https://docs.astral.sh/uv/) 并重新生成字体：

```sh
vp run fonts:build
```

生成的 `public/fonts/*.woff2`、`src/font-face.css` 和 `index.html` 应一起提交。
未重新生成时，新增字符仍可通过其余分片显示。

## 验证与部署

```sh
vp check
vp test
vp run deploy:check
```

测试使用独立的临时本地 D1，不修改开发或线上数据。`deploy:check` 构建前端并执行 Worker 部署预检，不上传。

首次部署时，先登录 Cloudflare、创建线上表并设置密码：

```sh
vp exec wrangler login
vp run db:migrate:remote
vp exec wrangler secret put PASSWORD
vp run deploy
```

`wrangler.jsonc` 已绑定现有 `sonnet` D1 数据库。`workers_dev` 为 false，
`deploy` 会在发布前应用尚未执行的数据库迁移。Cloudflare Workers Builds 的构建命令使用
`pnpm exec vp build`，部署命令使用
`pnpm run db:migrate:remote && pnpm exec wrangler deploy`，确保发布前先执行迁移。
构建使用的 API Token 需要包含此账号的 D1 编辑权限。
线上域名需在 Cloudflare 中关联到 `bnu-sonnet` Worker。
静态页面采用单页应用回退；`/api` 和 `/api/*` 优先交给 Worker，未知 API 返回 JSON 404。
