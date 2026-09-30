// UI strings: English is the key, `zh` translates it. The interface renders through `t()`;
// anything not in a table falls back to the key itself, which is the English source.
//
// `lang` is a global settings key. Switching reloads the view, so nothing is left half-lit.

const ZH = {
    // ---------- static screens ----------
    "RGB assets on Bitcoin, validated on your own device.": "比特币上的 RGB 资产，在你自己的设备上验证。",
    "Create a new wallet": "创建新钱包",
    "I have a recovery phrase": "我有助记词",
    "Keys and consignments never leave this device.": "私钥与货单永不离开这台设备。",
    "Import wallet": "导入钱包",
    "Recovery phrase": "助记词",
    "12 or 24 words, space separated": "12 或 24 个单词，空格分隔",
    "Password": "密码",
    "Repeat password": "重复密码",
    "8+ characters": "至少 8 个字符",
    "The password encrypts your recovery phrase on this device. There is no password recovery.":
        "密码用于在本设备加密你的助记词。密码无法找回。",
    "Create wallet": "创建钱包",
    "Step 1 of 2 · Set a password for this device.": "第 1 步 / 共 2 步 · 为本设备设置密码。",
    "Step 2 of 2 · Write these words down in order.": "第 2 步 / 共 2 步 · 按顺序抄下这些单词。",
    "Enter your recovery phrase, then set a password for this device.": "输入你的助记词，然后为本设备设置密码。",
    "Anyone with these words controls the wallet. Keep them offline.": "任何人拿到这些单词就控制了钱包。离线保存。",
    "Restore them only in an RGB wallet. An ordinary Bitcoin wallet cannot see RGB allocations, and spending one destroys the assets permanently.":
        "只能在 RGB 钱包里恢复。普通比特币钱包看不到 RGB 分配，花掉它会永久销毁资产。",
    "The words alone do not bring back RGB assets. Export a backup as well.": "只有助记词找不回 RGB 资产，还要导出备份。",
    "Written down and stored offline": "已抄下并离线保存",
    "Continue": "继续",
    "Welcome back": "欢迎回来",
    "Unlock": "解锁",
    "Lock": "锁定",
    "Settings": "设置",
    "Back": "返回",
    "Open in a tab so it stays open": "在标签页中打开，保持不关",
    "Bitcoin: receive and balances": "比特币：收款与余额",
    "Sync with the network and validate": "与网络同步并验证",
    "Sync": "同步",
    "Bitcoin · pays network fees": "比特币 · 支付网络手续费",
    "Receive": "收款",
    "Send": "发送",
    "Activity": "记录",
    "Backup": "备份",
    "Export": "导出",
    "RGB assets": "RGB 资产",
    "This covers the bitcoin in this wallet only. RGB assets cannot be exported this way.": "仅包含钱包里的 BTC，RGB 资产无法由此导出。",
    "Private key": "私钥",
    "Show private key": "显示私钥",
    "Anyone with this key can spend the bitcoin on it. Keep it offline.": "任何拿到这把私钥的人都能花上面的比特币。离线保存。",
    "This key does not match the wallet address.": "这把私钥与钱包地址不符。",
    "Assets": "资产",
    "Balance": "余额",
    "Loading…": "加载中…",
    "The Regtest chain was rebuilt, so this wallet's Regtest history no longer matches it. Resetting clears Regtest data on this device. Signet is not touched.":
        "Regtest 链已重建，本钱包的 Regtest 历史与它不再对应。重置会清空本设备的 Regtest 数据，不影响 Signet。",
    "Reset Regtest data": "重置 Regtest 数据",
    "RGB asset": "RGB 资产",
    "Bitcoin": "比特币",
    "No backup exported yet. If this device is lost, the recovery phrase alone will not restore the assets.":
        "尚未导出备份。一旦设备丢失，只有助记词找不回资产。",
    "Back up now": "立即备份",
    "Continue anyway": "仍要继续",
    "Copy": "复制",
    "Copied": "已复制",
    "Create an invoice and give it to the sender. Each invoice is used once.":
        "创建收款单交给发送方。每张收款单只用一次。",
    "Receive slots": "收款槽",
    "Each incoming transfer uses one. Adding slots costs an on-chain fee and takes 1 confirmation. With none ready the invoice still works — the sender creates the output instead, and can see which one it is.":
        "每笔转入用掉一个。添加收款槽要付链上手续费，1 个确认后可用。没有就绪的槽时收款单照常可用——由发送方创建输出，但发送方能看到是哪个输出。",
    "Add slots": "添加收款槽",
    "Receives plain Bitcoin, used for network fees.": "接收普通比特币，用于支付网络手续费。",
    "New invoice": "新建收款单",
    "Recipient invoice": "收款方收款单",
    "Asset": "资产",
    "Amount": "数量",
    "Network fee · sat/vB": "网络手续费 · sat/vB",
    "Spends plain Bitcoin only. UTXOs holding RGB assets are never touched.":
        "只花普通比特币。携带 RGB 资产的 UTXO 永不动用。",
    "Bitcoin address": "比特币地址",
    "Asset name": "资产名称",
    "All": "全部",
    "In progress": "进行中",
    "Done": "已完成",
    "Refresh": "刷新",
    "Expired invoices hold on to receive slots.": "过期的收款单会占住收款槽。",
    "Clear": "清理",
    "The recovery phrase alone does not restore RGB assets. Export a backup after receiving new assets.":
        "只有助记词找不回 RGB 资产。收到新资产后再导出一次备份。",
    "Backup password": "备份密码",
    "Restore from backup": "从备份恢复",
    "Import the same recovery phrase first, then select the backup file.": "先导入同一份助记词，再选择备份文件。",
    "Restore": "恢复",
    "Export encrypted backup": "导出加密备份",
    "Wallet": "钱包",
    "Network": "网络",
    "Connected sites": "已连接站点",
    "Security": "安全",
    "Change password": "修改密码",
    "Advanced": "高级",
    "Indexer": "索引器",
    "Asset index": "资产索引",
    "Issue an asset": "发行资产",
    "RGB proxy": "RGB 中转",
    "Danger zone": "危险区",
    "Erase this wallet": "抹掉这个钱包",
    "Esplora HTTP": "Esplora 接口",
    "Index address": "索引地址",
    "Asset names and warnings about lookalike tickers. The wallet asks for a network's whole asset list, never for the assets you hold, and caches it. Clear the field to turn it off, or point it at an index of your own.":
        "提供资产名称与仿冒代号警示。钱包一次请求整个网络的资产列表，从不请求你持有的资产，并会缓存。清空此栏即关闭，或指向你自己的索引。",
    "Ticker": "代号",
    "Name": "名称",
    "Supply": "发行量",
    "Decimals": "小数位",
    "The supply is fixed and all of it is issued to this wallet. Issuing uses one receive slot. The asset is not listed anywhere: whoever you send it to sees a contract ID and nothing else.":
        "发行量固定，全部发到本钱包。发行用掉一个收款槽。资产不会被任何地方收录：收到的人只看到合约 ID。",
    "Issue": "发行",
    "JSON-RPC endpoint": "JSON-RPC 端点",
    "Deletes the recovery phrase and all consignments from this device. Without a backup the assets cannot be recovered.":
        "删除本设备上的助记词与全部货单。没有备份则资产无法找回。",
    "I have a backup": "我已有备份",
    "Erase": "抹掉",
    "Save network settings": "保存网络设置",
    "Current password": "当前密码",
    "New password (8+ characters)": "新密码（至少 8 个字符）",
    "RGB engine: rgb-lib by RGB-Tools, with WASM bindings maintained by UTEXO. MIT.":
        "RGB 引擎：RGB-Tools 的 rgb-lib，WASM 绑定由 UTEXO 维护。MIT 许可。",

    // ---------- create / unlock / progress ----------
    "Working…": "处理中…",
    "Passwords do not match": "两次密码不一致",
    "Password must be at least 8 characters": "密码至少 8 个字符",
    "Unlocking…": "解锁中…",
    "Preparing the recovery phrase": "准备助记词",
    "Encrypting the recovery phrase": "加密助记词",
    "Opening the wallet": "打开钱包",
    "Connecting to the indexer": "连接索引器",
    "Elapsed": "已用时",

    // ---------- home ----------
    "Assets · {n}": "资产 · {n}",
    "No assets yet. Use Receive to get some.": "还没有资产。用「收款」获取。",
    "base units": "最小单位",
    "Precision unknown. The balance is the raw base-unit value.": "精度未知，余额按最小单位原值显示。",
    "{n} other contracts use the ticker {ticker}. A ticker is not an identity: check the contract id.":
        "另有 {n} 个合约使用代号 {ticker}。代号不是身份：请核对合约 ID。",
    "{n} other contract uses the ticker {ticker}. A ticker is not an identity: check the contract id.":
        "另有 {n} 个合约使用代号 {ticker}。代号不是身份：请核对合约 ID。",
    "A complaint about this asset was accepted and is unresolved.": "该资产有一条被受理且未解决的投诉。",
    "Not registered with the configured index. That is not a verdict: the asset is identified by its contract id above.":
        "未在当前配置的索引中登记。这不构成判断：资产以上方的合约 ID 为准。",
    "Issuer: reviewed by the index operator.": "发行方：已由索引运营方审核。",
    "Issuer: verified against a domain or account.": "发行方：已通过域名或账号验证。",
    "Issuer: signed by a key, with no identity proof.": "发行方：仅密钥签名，无身份证明。",
    "Issuer: no issuer has claimed it.": "发行方：无人认领。",
    " Listed by a publisher's ledger.": " 已列入发布者账本。",
    "+{n} incoming": "+{n} 转入中",
    "−{n} leaving": "−{n} 转出中",
    "Synced {t} ago": "{t}前同步",
    "Sync in {n}s": "{n} 秒后可同步",
    "Verifying…": "验证中…",
    "Last sync took {ms} ms": "上次同步耗时 {ms} 毫秒",
    "Includes {n} BTC waiting to confirm": "含 {n} BTC 等待确认",
    "≈ {m} min to confirm": "≈ {m} 分钟后确认",
    "Regtest data cleared. Unlock to sync with the current chain.": "Regtest 数据已清空。解锁后与当前链同步。",
    "Indexer unreachable: {e}": "索引器不可达：{e}",
    "The indexer address is not an Esplora API. Pick one from the list in Settings → Indexer.":
        "该索引器地址不是 Esplora 接口。请到「设置 → 索引器」从列表里选一个。",
    "No RGB proxy configured. Sending and receiving need one.": "未配置 RGB 中转。收发都需要它。",

    // ---------- receive / send ----------
    "{n} ready": "{n} 个就绪",
    "{n} waiting": "{n} 个待确认",
    "No slot ready — the invoice will use the sender's output instead.": "没有就绪的收款槽——收款单将改用发送方的输出。",
    "Adding…": "添加中…",
    "Created {n} slots. Usable after 1 confirmation.": "已创建 {n} 个收款槽，1 个确认后可用。",
    "No slot used · the sender creates the output and can see which one it is. Invoices stay this kind until this one is used or expires.":
        "未占用收款槽 · 由发送方创建输出，发送方能看到是哪个输出。在本单被使用或过期前，收款单都将是这种。",
    "Uses one slot · the sender sees nothing but a blinded identifier": "占用一个收款槽 · 发送方只能看到一个盲化标识",
    "· expires {t}": "· {t} 过期",
    "Available": "可用",
    "Confirmed": "已确认",
    "Waiting to confirm": "等待确认",
    "In RGB UTXOs": "在 RGB UTXO 中",
    "RGB UTXOs carry the assets. Their Bitcoin is not spendable as plain BTC.": "RGB UTXO 承载资产，其中的比特币不能当作普通 BTC 花费。",
    "Creating slots waits for every input to confirm.": "创建收款槽需等待所有输入确认。",
    "No assets": "暂无资产",
    "{rate} sat/vB, set above what the network is clearing. Adjust if you want.":
        "{rate} sat/vB，刻意高于当前网络清算价。可自行调整。",
    "Could not reach the network for an estimate — enter a rate manually.": "无法从网络获取估算——请手动输入费率。",
    "precision unknown, enter base units": "精度未知，请输入最小单位",
    "up to {n} decimals": "最多 {n} 位小数",
    "Max {v}": "最大 {v}",
    "Send {v} {ticker}": "发送 {v} {ticker}",
    "Spendable {v} BTC": "可花 {v} BTC",
    "Spendable {v} sats": "可花 {v} sats",
    "= {v} sats": "= {v} sats",
    "= {v} BTC": "= {v} BTC",
    "More than the confirmed balance — the rest is still waiting to confirm. If that transaction never confirms, this send fails with it.":
        "超过已确认余额——其余部分仍在等待确认。若那笔交易最终没确认，本次发送会一并失败。",
    "Amount must be positive": "金额必须大于零",
    "Enter a whole number of sats": "请输入整数 sats",
    "Amount must be greater than zero": "金额必须大于零",
    "Insufficient balance — spendable is {v} BTC": "余额不足——可花 {v} BTC",
    "Any amount": "任意数量",
    "Expires": "过期时间",
    "Consignment to": "货单发往",
    "Any asset": "任意资产",
    "Invoice names no consignment endpoint; the configured proxy will be used.": "收款单未指定货单端点，将使用已配置的中转。",
    "Select an asset": "请选择资产",
    "Invalid amount: {e}": "金额无效：{e}",
    "More than can be sent now. Max {v}": "超出当前可发送量。最大 {v}",
    "Sending…": "发送中…",
    "Sent · <txid>": "已发送 · <txid>",
    "Broadcast": "已广播",
    "Identity address. Click to copy": "身份地址，点击复制",
    "These sites can see your identity address and request signatures. Every signature still needs your approval.": "这些站点能看到你的身份地址并请求签名。每次签名仍需你批准。",
    "Nothing is on chain until the recipient accepts it. The wallet finishes that on its own — leave it unlocked until it does. Locking or closing the browser first means sending again; the asset stays here either way.":
        "对方接受前不会上链。钱包会自行完成——请保持解锁直到完成。提前锁定或关闭浏览器等于没发出去；无论哪种情况资产都在这里。",
    "Enter an amount": "请输入金额",
    "Amount must be a whole number of sats": "金额必须是整数 sats",
    "Broadcast <txid>": "已广播 <txid>",

    // ---------- activity ----------
    "Waiting for the other side": "等待对方",
    "Confirming": "确认中",
    "Settled": "已完成",
    "Failed": "失败",
    "in the mempool": "在内存池",
    "{n} of {t}": "{n} / {t}",
    "{n} confirmations": "{n} 个确认",
    "Nothing here.": "这里没有记录。",
    "Nothing yet.": "暂无记录。",
    "Issued": "发行",
    "Received": "收到",
    "Sent": "发送",
    "{t} ago": "{t}前",
    "Cancel": "取消",
    "Clearing…": "清理中…",
    "Cleared. {n} free slots.": "已清理。空出 {n} 个收款槽。",

    // ---------- backup ----------
    "Packing…": "打包中…",
    "Exported. The backup password is separate from the wallet password.": "已导出。备份密码与钱包密码各自独立。",
    "Select a backup file": "请选择备份文件",
    "Restoring…": "恢复中…",
    "Restored.": "已恢复。",

    // ---------- settings ----------
    "No sites connected.": "暂无已连接站点。",
    "Revoke": "断开",
    "Needed": "待备份",
    "Up to date": "已备份",
    "Saved": "已保存",
    "Saved and applied": "已保存并生效",
    "Access to those endpoints was not granted": "未获得这些端点的访问权限",
    "Password changed": "密码已修改",
    "A ticker and a name are required": "代号和名称必填",
    "The supply must be a whole number above 0": "发行量必须是大于 0 的整数",
    "Decimals must be between 0 and 18": "小数位必须在 0 到 18 之间",
    "Issuing…": "发行中…",
    "Issued {ticker}. {assetId}": "已发行 {ticker}。{assetId}",
    "Language": "语言",
    "English": "English",
    "中文": "中文",
    "Show recovery phrase": "显示助记词",
    "Hide": "隐藏",
    "Wrong password": "密码错误",
    "A transfer is waiting for its recipient. Let it finish before changing settings.":
        "还有一笔转账在等待对方回执。先等它完成再改设置。",
    "Indexer list": "索引器列表",
    "Remove": "移除",
    "Retest": "重新测速",
    "{ms} ms": "{ms} 毫秒",
    "unreachable": "不可达",
    "This endpoint did not answer like an Esplora API.": "该端点的响应不是 Esplora 接口。",
    "Save settings": "保存设置",
    "Settings saved. They take effect right away.": "设置已保存，立即生效。",

    // ---------- approve window ----------
    "Darkhorse's own site": "Darkhorse 自有站点",
    "The offer could not be read from {b}": "无法从 {b} 读取该挂单",
    "You pay": "你支付",
    "You receive": "你收到",
    "Signing address": "签名地址",
    "Connect": "连接",
    "The site will see your identity address and can request signatures. Every signature still needs your approval here.":
        "该站点将看到你的身份地址，并可请求签名。每次签名仍需在本窗口批准。",
    "Connecting moves no assets and does not expose your keys.": "连接不移动任何资产，也不暴露私钥。",
    "Signature request": "签名请求",
    "Message": "消息",
    "Moves no assets. Proves you control the address above.": "不移动任何资产。证明你控制上方地址。",
    "Prepare a swap": "准备兑换",
    "This opens an invoice of your wallet and picks a UTXO to pay with. Nothing is signed and nothing moves yet.":
        "这会打开你钱包的一张收款单并选出一个支付 UTXO。不签名，不动资产。",
    "Sign swap": "签名兑换",
    "Your sats and the asset change hands in one transaction: both or neither.":
        "你的聪与资产在同一笔交易里换手：要么都成，要么都不成。",
    "The wallet checks every output against the offer before signing, and refuses if anything differs.":
        "签名前钱包会逐项核对每个输出与挂单，有出入即拒绝。",
    "The seller signs after you and broadcasts it.": "卖方在你之后签名并广播。",
    "Wait for one confirmation before treating the asset as received.": "等 1 个确认后再视为资产已到账。",
    "Prepare your sale": "准备出售",
    "Someone took your offer. This builds the transaction from your wallet and reserves the asset for it. Nothing is signed yet; the buyer signs next.":
        "有人吃掉了你的挂单。这会从你的钱包构建交易并为它预留资产。尚未签名；接下来买方签名。",
    "Sign and broadcast your sale": "签名并广播出售",
    "The buyer has signed.": "买方已签名。",
    "The asset leaves your wallet and the sats arrive in the same transaction, or neither happens.":
        "资产离开钱包与聪到账发生在同一笔交易，要么都成，要么都不成。",
    "Only the transaction your wallet prepared can be signed.": "只有你钱包准备的那笔交易可以被签名。",
    "Unknown request": "未知请求",
    "Approve": "批准",
    "Prepare": "准备",
    "Sign": "签名",
    "Sign and broadcast": "签名并广播",
    "Reject": "拒绝",
};

let lang = "en";

/** The locale tag for date/number formatting. */
export const localeOf = () => (lang === "zh" ? "zh-CN" : "en");

export function setLang(next) {
    lang = next === "zh" ? "zh" : "en";
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
}

/**
 * Translates one string. `{name}` placeholders come from `vars`, in both languages, so the
 * same call site works for either table.
 */
export function t(key, vars) {
    let s = (lang === "zh" && ZH[key]) || key;
    for (const [k, v] of Object.entries(vars || {})) s = s.replaceAll(`{${k}}`, String(v));
    return s;
}

/** Applies translations to static markup: text via `data-i18n`, placeholders via `data-i18n-ph`. */
export function applyI18n(root = document) {
    for (const el of root.querySelectorAll("[data-i18n]")) el.textContent = t(el.getAttribute("data-i18n"));
    for (const el of root.querySelectorAll("[data-i18n-ph]")) el.placeholder = t(el.getAttribute("data-i18n-ph"));
    for (const el of root.querySelectorAll("[data-i18n-title]")) {
        const s = t(el.getAttribute("data-i18n-title"));
        el.title = s;
        if (el.hasAttribute("aria-label")) el.setAttribute("aria-label", s);
    }
}
