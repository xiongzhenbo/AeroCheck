export type Language = 'zh' | 'en';

export const TRANSLATIONS = {
  zh: {
    brandName: 'AeroCheck 机务检查单',
    brandShort: 'AeroCheck',
    navNewType: '新建类型',
    navBackupInstall: '安装与备份',
    themeLight: '日间模式',
    themeDark: '夜间模式',
    langSwitchLabel: 'EN',
    langSwitchAria: 'Switch to English',
    offlineBanner: '离线模式 · 本地检查单数据正常运行',

    // Sidebar / Switcher
    checklistTypes: '检查单类型',
    searchChecklistPlaceholder: '搜索检查单名称、代号或机型',
    clearSearch: '清除搜索',
    noChecklistMatch: (query: string) => `未找到包含「${query}」的检查单`,
    sortBtn: '排序',
    newTypeBtn: '新建类型',
    manageShort: '管理',
    newShort: '新建',
    sidebarHint: '支持离线保存于本机。可导出 JSON 分享给同班组机务同事，或安装到手机桌面。',
    backupModalBtn: '安装指引与导入导出备份',
    typeSettingsAria: (name: string) => `设置 ${name}`,

    // Header / Filters
    itemsCount: (count: number) => `共 ${count} 项`,
    completedCountLabel: '已完成项',
    checklistDoneLabel: '检查完成',
    filterAll: (count: number) => `全部 ${count}`,
    filterPending: (count: number) => `待检查 ${count}`,
    filterDone: (count: number) => `已变绿 ${count}`,

    // Actions
    editItems: '编辑/排序项目',
    exitEditMode: '退出编辑模式',
    editItemsShort: '编辑项目',
    doneEditShort: '完成编辑',
    addItem: '添加检查项',
    addItemShort: '添加项目',
    resetChecklist: '一键重置检查单',
    resetShort: '一键重置',
    resetAndReuse: '一键重置复用',

    // Complete banner & edit banner
    allCompleteTitle: (name: string) => `${name} 全部项目已确认完成`,
    allCompleteSub: (total: number) => `CHECKLIST COMPLETE · ${total}/${total} ITEMS VERIFIED`,
    editModeBanner: '当前处于编辑模式：可按住左侧手柄拖动排序，或点击修改、删除条目',
    addNewItemInline: '+ 添加新项目',
    doneEditingBtn: '完成编辑',

    // Empty states
    emptyItemsTitle: (name: string) => `「${name}」暂无检查项目`,
    emptyItemsSub: '您可以手动逐条添加检查内容，或使用批量粘贴快速导入。',
    addFirstItem: '添加第一条检查项',
    emptyPendingFilter: '没有待检查的项目，已全部变绿确认',
    emptyDoneFilter: '当前还没有已变绿确认的项目',
    showAllItems: '显示全部项目',

    // Item row
    verified: '已确认',
    tapToCheck: '点击确认',
    dragToReorder: '按住拖动排序',
    moveUp: '上移',
    moveDown: '下移',
    edit: '编辑',
    remove: '删除',

    // Undo Toast
    undoResetMsg: (name: string) => `已重置「${name}」，可开始下一架次`,
    undoBtn: '撤销',
    backExitToast: '再划一次退出（建议直接底部上划切后台，可防卡启动页）',

    // Checklist Modal
    editChecklistTitle: '编辑检查单类型',
    newChecklistTitle: '新建检查单类型',
    checklistNameLabel: '检查单名称 *',
    checklistNamePlaceholder: '例如：航前检查、除冰后复检',
    checklistCodeLabel: '类型代号',
    checklistCodePlaceholder: '如 PF / AF',
    aircraftModelLabel: '适用机型或作业场景',
    aircraftModelPlaceholder: '例如：A320neo / B737-800 / 冬季除防冰',
    checklistDescLabel: '备注说明',
    checklistDescPlaceholder: '可选：填写执行时机、注意事项或工卡依据',
    duplicateBtn: '复制一份',
    deleteTypeBtn: '删除此类型',
    confirmDeleteType: (count: number) => `确认删除 (${count} 项)`,
    cancel: '取消',
    saveChanges: '保存修改',
    createChecklist: '创建检查单',
    close: '关闭',

    // Order Modal
    orderModalTitle: '调整检查单显示顺序',
    orderModalSub: '按住左侧手柄上下拖动，或使用右侧按钮调整顺序',
    orderModalItemMeta: (count: number, model?: string) =>
      `${count} 项${model ? ` · ${model}` : ''}`,
    pinTop: '置顶',
    doneSorting: '完成排序',

    // Item Modal
    editItemTitle: '编辑检查项目',
    addItemTitle: (name: string) => `添加检查项目 · ${name}`,
    insertPositionLabel: '插入位置',
    insertAtTop: '加到最上方',
    insertAtBottom: '加到最后边',
    singleEntryTab: '逐条录入',
    batchImportTab: '批量粘贴导入',
    addedNotice: (title: string) => `已添加「${title}」，可继续输入下一项`,
    itemTitleLabel: '检查项目名称 *',
    itemTitlePlaceholder: '例如：主起落架刹车磨损指示销检查',
    itemSpecLabel: '检查标准 / 预期状态',
    itemSpecPlaceholder: '例如：指示销伸出长度满足手册要求，无液压渗漏',
    itemZoneLabel: '区域或 ATA 章节（选填）',
    itemZonePlaceholder: '例如：ATA 32 / 左发 / 驾驶舱',
    done: '完成',
    saveAndAddAnother: '保存并继续添加',
    addItemSubmit: '添加项目',
    batchLabel: '每行一条检查项（支持用「|」分隔标准或区域）',
    batchPlaceholder:
      '示例格式（每行一条）：\n空速管保护套确认 | 已取下且表面清洁\nATA 32 | 主轮轮胎与刹车 | 无扎伤，磨损指示销正常\nAPU 滑油油位检查',
    batchRecognized: (count: number) => `已识别 ${count} 条可导入项目`,
    batchSubmit: (count: number) => `导入 ${count} 项`,

    // Backup & Install Modal
    backupTitle: '安装指引与数据备份',
    exportSuccess: (count: number) => `已导出 ${count} 份检查单模板`,
    importSuccess: (count: number) => `成功导入 ${count} 份检查单`,
    importError: '文件格式无效，请选择导出的 JSON 备份文件',
    restoreSuccess: '已恢复默认机务检查单模板',
    installSectionTitle: '安装为手机离线应用 (PWA)',
    installSectionDesc:
      '支持离线运行于机坪与机库，所有检查单数据本地存储。若未自动弹出安装按钮，可使用浏览器菜单「添加到手机 / 安装应用 / 添加到主屏幕」。',
    backupSectionTitle: '模板导出与班组共享',
    exportBtn: '导出检查单备份',
    importBtn: '导入备份文件',
    restoreDefaultsDesc: '恢复初始默认模板（航前 / 过站 / 航后 / 周检）',
    restoreDefaultsBtn: '恢复默认',
    confirmRestoreDefaults: '确认覆盖恢复',

    // PWA Install Button
    runningStandalone: '当前已以独立应用模式运行',
    installNow: '一键安装到手机桌面',
    openInNewTab: '在新标签页打开后安装',
    iosGuideBtn: 'iOS 添加到桌面教程',
    androidGuideBtn: '查看手机安装步骤',
    iosGuideTitle: '安装到 iPhone / iPad 主屏幕',
    edgeGuideTitle: '在安卓 Edge 浏览器中安装',
    androidGuideTitle: '安装到安卓手机桌面',
    iosStep1: '1. 点击 Safari 底部工具栏的「分享」按钮。',
    iosStep2: '2. 向下滑动并选择「添加到主屏幕」。',
    iosStep3: '3. 点击右上角「添加」即可像原生应用一样离线使用。',
    androidStep1: '1. 点击安卓 Edge 底部菜单栏右侧的「≡」菜单按钮（Chrome 请点右上角「⋮」）。',
    androidStep2: '2. 在弹出菜单中找到并点击「添加到手机」（或「安装应用 / 添加到主屏幕」）。',
    androidStep3: '3. 确认应用名称「机务检查单」后点击「添加 / 安装」，桌面就会生成独立应用图标。',
    androidTip:
      '提示：如果桌面未出现图标，请在手机「设置 → 应用管理 → 浏览器 → 权限管理」中开启「创建桌面快捷方式」。',
    gotIt: '知道了',
  },
  en: {
    brandName: 'AeroCheck ECL',
    brandShort: 'AeroCheck',
    navNewType: 'New Checklist',
    navBackupInstall: 'Install & Backup',
    themeLight: 'Day Mode',
    themeDark: 'Night Mode',
    langSwitchLabel: '中文',
    langSwitchAria: '切换为中文界面',
    offlineBanner: 'Offline Mode · Local checklists active',

    // Sidebar / Switcher
    checklistTypes: 'Checklists',
    searchChecklistPlaceholder: 'Search name, code, or aircraft...',
    clearSearch: 'Clear',
    noChecklistMatch: (query: string) => `No checklist matching "${query}"`,
    sortBtn: 'Order',
    newTypeBtn: 'New Type',
    manageShort: 'Manage',
    newShort: 'New',
    sidebarHint:
      'Stored locally for offline ramp use. Export JSON to share templates or install on your phone.',
    backupModalBtn: 'Install Guide & JSON Backup',
    typeSettingsAria: (name: string) => `Settings for ${name}`,

    // Header / Filters
    itemsCount: (count: number) => `${count} items`,
    completedCountLabel: 'Verified',
    checklistDoneLabel: 'Complete',
    filterAll: (count: number) => `All ${count}`,
    filterPending: (count: number) => `Pending ${count}`,
    filterDone: (count: number) => `Verified ${count}`,

    // Actions
    editItems: 'Edit / Reorder',
    exitEditMode: 'Exit Edit Mode',
    editItemsShort: 'Edit Items',
    doneEditShort: 'Done',
    addItem: 'Add Item',
    addItemShort: 'Add Item',
    resetChecklist: 'Reset Checklist',
    resetShort: 'Reset',
    resetAndReuse: 'Reset for Reuse',

    // Complete banner & edit banner
    allCompleteTitle: (name: string) => `${name} — All Items Verified`,
    allCompleteSub: (total: number) => `CHECKLIST COMPLETE · ${total}/${total} ITEMS VERIFIED`,
    editModeBanner: 'Edit Mode: Drag the left handle to reorder items, or tap to edit / delete',
    addNewItemInline: '+ Add Item',
    doneEditingBtn: 'Done',

    // Empty states
    emptyItemsTitle: (name: string) => `No items in "${name}"`,
    emptyItemsSub: 'Add checklist items manually or paste multiple lines at once.',
    addFirstItem: 'Add First Item',
    emptyPendingFilter: 'All items have been verified green',
    emptyDoneFilter: 'No verified items yet',
    showAllItems: 'Show All Items',

    // Item row
    verified: 'VERIFIED',
    tapToCheck: 'Tap to check',
    dragToReorder: 'Drag to reorder',
    moveUp: 'Move up',
    moveDown: 'Move down',
    edit: 'Edit',
    remove: 'Delete',

    // Undo Toast
    undoResetMsg: (name: string) => `Reset "${name}" for next turn`,
    undoBtn: 'Undo',
    backExitToast: 'Swipe back again to exit (swipe up to Home recommended)',

    // Checklist Modal
    editChecklistTitle: 'Edit Checklist Type',
    newChecklistTitle: 'New Checklist Type',
    checklistNameLabel: 'Checklist Name *',
    checklistNamePlaceholder: 'e.g., Pre-Flight, De-Icing Check',
    checklistCodeLabel: 'Short Code',
    checklistCodePlaceholder: 'e.g. PF / AF',
    aircraftModelLabel: 'Aircraft / Scenario',
    aircraftModelPlaceholder: 'e.g., A320neo / B737-800 / Line Maint',
    checklistDescLabel: 'Notes',
    checklistDescPlaceholder: 'Optional: Timing, task card ref, or cautions',
    duplicateBtn: 'Duplicate',
    deleteTypeBtn: 'Delete Type',
    confirmDeleteType: (count: number) => `Confirm Delete (${count})`,
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    createChecklist: 'Create Checklist',
    close: 'Close',

    // Order Modal
    orderModalTitle: 'Reorder Checklists',
    orderModalSub: 'Drag the left handle up/down or use the buttons to set priority order',
    orderModalItemMeta: (count: number, model?: string) =>
      `${count} items${model ? ` · ${model}` : ''}`,
    pinTop: 'Pin to top',
    doneSorting: 'Done',

    // Item Modal
    editItemTitle: 'Edit Checklist Item',
    addItemTitle: (name: string) => `Add Item · ${name}`,
    insertPositionLabel: 'Insert Position',
    insertAtTop: 'Add to Top',
    insertAtBottom: 'Add to Bottom',
    singleEntryTab: 'Single Entry',
    batchImportTab: 'Batch Paste',
    addedNotice: (title: string) => `Added "${title}". Enter the next item below.`,
    itemTitleLabel: 'Item Title *',
    itemTitlePlaceholder: 'e.g., Main Gear Brake Wear Pin Check',
    itemSpecLabel: 'Standard / Expected Condition',
    itemSpecPlaceholder: 'e.g., Wear pin within limits, no hydraulic leaks',
    itemZoneLabel: 'Zone or ATA Chapter (Optional)',
    itemZonePlaceholder: 'e.g., ATA 32 / ENG #1 / Cockpit',
    done: 'Done',
    saveAndAddAnother: 'Save & Add Another',
    addItemSubmit: 'Add Item',
    batchLabel: 'One item per line (use "|" to separate spec or zone)',
    batchPlaceholder:
      'Example format (one per line):\nPitot & Static Covers | Removed and ports clear\nATA 32 | MLG Tires & Brakes | No cuts, wear pins normal\nAPU Oil Level Check',
    batchRecognized: (count: number) => `${count} items ready to import`,
    batchSubmit: (count: number) => `Import ${count} Items`,

    // Backup & Install Modal
    backupTitle: 'Install Guide & Backup',
    exportSuccess: (count: number) => `Exported ${count} checklist templates`,
    importSuccess: (count: number) => `Imported ${count} checklists`,
    importError: 'Invalid file format. Please select an exported JSON backup file.',
    restoreSuccess: 'Restored default maintenance checklist templates',
    installSectionTitle: 'Install as Offline Mobile App (PWA)',
    installSectionDesc:
      'Works offline on the ramp and hangar with local storage. If no install button appears, use your browser menu "Add to phone / Install app / Add to Home Screen".',
    backupSectionTitle: 'Export & Team Sharing',
    exportBtn: 'Export Checklists JSON',
    importBtn: 'Import JSON Backup',
    restoreDefaultsDesc: 'Restore default templates (Pre-Flight / Transit / Post-Flight / Weekly)',
    restoreDefaultsBtn: 'Restore Defaults',
    confirmRestoreDefaults: 'Confirm Overwrite',

    // PWA Install Button
    runningStandalone: 'Running as installed standalone app',
    installNow: 'Install to Home Screen',
    openInNewTab: 'Open Standalone Tab to Install',
    iosGuideBtn: 'iOS Install Guide',
    androidGuideBtn: 'Android Install Steps',
    iosGuideTitle: 'Install on iPhone / iPad',
    edgeGuideTitle: 'Install via Android Edge',
    androidGuideTitle: 'Install on Android Home Screen',
    iosStep1: '1. Tap the Share button in the bottom Safari toolbar.',
    iosStep2: '2. Scroll down and tap "Add to Home Screen".',
    iosStep3: '3. Tap "Add" to launch full-screen and offline like a native app.',
    androidStep1:
      '1. Tap the "≡" menu at bottom-right in Edge (or "⋮" top-right in Chrome).',
    androidStep2: '2. Select "Add to phone" (or "Install app / Add to Home screen").',
    androidStep3: '3. Confirm the app name and tap "Add / Install" to create the icon.',
    androidTip:
      'Tip: If no shortcut appears on your home screen, enable "Create home screen shortcuts" in System Settings → Apps → Browser Permissions.',
    gotIt: 'Got It',
  },
} as const;
