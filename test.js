/**
 * 网站文件验证测试
 * 验证网站文件是否正确创建
 */

const fs = require('fs');
const path = require('path');

function testWebsite() {
    console.log('========================================');
    console.log('摄影作品展示网站 - 文件验证测试');
    console.log('========================================\n');
    
    let allPassed = true;
    const baseDir = __dirname;
    
    // 检查目录结构
    console.log('1. 检查目录结构...');
    const directories = ['css', 'js', 'images', 'assets'];
    
    directories.forEach(dir => {
        const dirPath = path.join(baseDir, dir);
        const exists = fs.existsSync(dirPath);
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + dir + ' 目录');
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 检查主文件
    console.log('2. 检查主文件...');
    const mainFiles = [
        { name: 'index.html', path: path.join(baseDir, 'index.html') },
        { name: 'style.css', path: path.join(baseDir, 'css', 'style.css') },
        { name: 'main.js', path: path.join(baseDir, 'js', 'main.js') }
    ];
    
    mainFiles.forEach(file => {
        const exists = fs.existsSync(file.path);
        const size = exists ? fs.statSync(file.path).size : 0;
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + file.name + ' (' + (size / 1024).toFixed(1) + ' KB)');
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 验证 HTML 内容
    console.log('3. 验证 HTML 内容...');
    const htmlContent = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
    
    const htmlElements = [
        { selector: 'hero-section', description: 'Hero 区域' },
        { selector: 'gallery-section', description: '作品画廊区域' },
        { selector: 'about-section', description: '关于区域' },
        { selector: 'contact-section', description: '联系区域' },
        { selector: 'main-nav', description: '导航栏' },
        { selector: 'lightbox', description: '灯箱弹窗' },
        { selector: 'contactForm', description: '联系表单' },
        { selector: 'custom-cursor', description: '自定义光标' },
        { selector: 'page-loader', description: '页面加载动画' }
    ];
    
    htmlElements.forEach(elem => {
        const exists = htmlContent.includes('id="' + elem.selector + '"') || 
                      htmlContent.includes('class="' + elem.selector + '"') ||
                      htmlContent.includes("id='" + elem.selector + "'") ||
                      htmlContent.includes("class='" + elem.selector + "'");
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + elem.description);
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 验证 CSS 内容
    console.log('4. 验证 CSS 内容...');
    const cssContent = fs.readFileSync(path.join(baseDir, 'css', 'style.css'), 'utf8');
    
    const cssFeatures = [
        { pattern: 'animation', description: '动画定义' },
        { pattern: 'transition', description: '过渡效果' },
        { pattern: 'transform', description: '变换效果' },
        { pattern: '@media', description: '响应式设计' },
        { pattern: 'keyframes', description: '关键帧动画' },
        { pattern: 'cursor', description: '自定义光标样式' },
        { pattern: 'scroll-behavior', description: '滚动行为控制' },
        { pattern: 'opacity', description: '透明度动画' }
    ];
    
    cssFeatures.forEach(feature => {
        const exists = cssContent.toLowerCase().includes(feature.pattern.toLowerCase());
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + feature.description);
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 验证 JavaScript 内容
    console.log('5. 验证 JavaScript 功能...');
    const jsContent = fs.readFileSync(path.join(baseDir, 'js', 'main.js'), 'utf8');
    
    const jsFeatures = [
        { pattern: 'DOMContentLoaded', description: 'DOM 加载事件' },
        { pattern: 'Lenis', description: '平滑滚动功能' },
        { pattern: 'initCustomCursor', description: '自定义光标' },
        { pattern: 'initGallery', description: '作品画廊功能' },
        { pattern: 'initLightbox', description: '灯箱弹窗功能' },
        { pattern: 'initContactForm', description: '联系表单功能' },
        { pattern: 'initScrollAnimations', description: '滚动动画功能' },
        { pattern: 'IntersectionObserver', description: '视差滚动效果' }
    ];
    
    jsFeatures.forEach(feature => {
        const exists = jsContent.includes(feature.pattern);
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + feature.description);
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 验证外部资源引用
    console.log('6. 验证外部资源引用...');
    
    const externalResources = [
        { pattern: 'fonts.googleapis.com', description: 'Google Fonts' },
        { pattern: 'cdnjs.cloudflare.com/ajax/libs/gsap', description: 'GSAP 动画库' },
        { pattern: 'cdn.jsdelivr.net/npm/@studio-freight/lenis', description: 'Lenis 平滑滚动' },
        { pattern: 'images.unsplash.com', description: 'Unsplash 示例图片' }
    ];
    
    externalResources.forEach(resource => {
        const exists = htmlContent.includes(resource.pattern);
        console.log('   ' + (exists ? '✓' : '✗') + ' ' + resource.description);
        if (!exists) allPassed = false;
    });
    
    console.log('');
    
    // 输出结果汇总
    console.log('========================================');
    console.log('测试结果汇总');
    console.log('========================================');
    
    if (allPassed) {
        console.log('\n✓ 所有测试通过！\n');
        console.log('网站功能包括：');
        console.log('  • 极简主义现代化设计');
        console.log('  • 丰富的动画和交互效果');
        console.log('  • 自定义光标');
        console.log('  • 平滑滚动（Lenis）');
        console.log('  • GSAP 滚动动画');
        console.log('  • 作品画廊与分类筛选');
        console.log('  • 灯箱弹窗功能');
        console.log('  • 联系表单');
        console.log('  • 响应式设计（适配移动端）');
        console.log('');
    } else {
        console.log('\n✗ 部分测试未通过，请检查上述输出。\n');
        process.exit(1);
    }
    
    console.log('========================================');
    console.log('测试完成！');
    console.log('========================================\n');
}

testWebsite();
