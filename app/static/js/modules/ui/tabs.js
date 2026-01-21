// UI Tabs & Sidebar Management

export function switchTab(tabId) {
    // Hide all content
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Deactivate all buttons
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    // Show target content
    const target = document.getElementById('tab-' + tabId);
    if (target) target.classList.remove('hidden');

    // Activate target button
    const btn = document.getElementById('btn-' + tabId);
    if (btn) btn.classList.add('active');
}

export function toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('overlay');
    sb.classList.toggle('open');
    ov.classList.toggle('open');
}

export function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => console.log(e));
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
