/**
 * الموقع التعريفي الشخصي للمهندس وسيم محمد حفظ الله الشيخ
 * كود الجافاسكريبت التفاعلي (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. تهيئة الوضع الداكن والفاتح (Dark/Light Mode)
    initThemeToggle();

    // 2. تهيئة الصورة الشخصية
    initAvatar();

    // 3. شريط تقدم التمرير وتأثير الهيدر الثابت
    initScrollEffects();

    // 4. تأثير كتابة العناوين التلقائي في الهيرو (Typing Effect)
    initTypingEffect();

    // 5. عداد الإحصائيات الرقمية (Stat Counters)
    initCounterAnimation();

    // 6. تحريك أشرطة تقدم المهارات عند التمرير (Progress Bars)
    initSkillBars();

    // 7. قائمة الموبايل التفاعلية (Mobile Nav Menu)
    initMobileMenu();

    // 8. فلترة المشاريع التفاعلية
    initProjectFilters();

    // 9. تحديث السنة الحالية في الفوتر
    initFooterYear();
});

/* ==========================================================================
   1. التحكم في الوضع الداكن والفاتح (Dark & Light Mode)
   ========================================================================== */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;

    // استرجاع تفضيل المستخدم المحفوظ أو التفضيل التلقائي للنظام
    const savedTheme = localStorage.getItem('user_portfolio_theme');
    
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }

    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        
        if (isLight) {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('user_portfolio_theme', 'dark');
            showToast('تم تفعيل الوضع الداكن الفاخر');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('user_portfolio_theme', 'light');
            showToast('تم تفعيل الوضع النهاري المشرق');
        }
    });
}

/* ==========================================================================
   2. إدارة وعرض الصورة الشخصية للمهندس وسيم (Avatar Image Handling)
   ========================================================================== */
function initAvatar() {
    const avatarPhoto = document.getElementById('avatarPhoto');
    const avatarFallback = document.getElementById('avatarFallback');
    if (!avatarPhoto) return;

    // فحص ما إذا كان المستخدم قد حفظ صورة سابقة في المتصفح
    const cachedAvatar = localStorage.getItem('waseem_saved_avatar');
    if (cachedAvatar) {
        avatarPhoto.src = cachedAvatar;
        avatarPhoto.style.display = 'block';
        if (avatarFallback) avatarFallback.style.display = 'none';
    }
}

// معالجة البحث التلقائي عن اسم ملف الصورة
let avatarFallbackAttempt = 0;
function handleAvatarFallback(imgElement) {
    avatarFallbackAttempt++;
    const fallbackList = [
        'waseem.png',
        'personal-photo.jpg',
        'personal-photo.png',
        'waseem.jpeg'
    ];

    if (avatarFallbackAttempt <= fallbackList.length) {
        imgElement.src = fallbackList[avatarFallbackAttempt - 1];
    } else {
        imgElement.style.display = 'none';
        const fallback = document.getElementById('avatarFallback');
        if (fallback) fallback.style.display = 'flex';
    }
}

// رفع واختيار صورة مباشرة من الجهاز مع حفظها في المتصفح تلقائياً
function handleAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('يرجى اختيار ملف صورة صالح (JPG, PNG)');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        const avatarPhoto = document.getElementById('avatarPhoto');
        const avatarFallback = document.getElementById('avatarFallback');

        if (avatarPhoto) {
            avatarPhoto.src = base64Data;
            avatarPhoto.style.display = 'block';
        }
        if (avatarFallback) {
            avatarFallback.style.display = 'none';
        }

        try {
            localStorage.setItem('waseem_saved_avatar', base64Data);
            showToast('تم تحديث صورتك الشخصية بنجاح وحفظها!');
        } catch (err) {
            showToast('تم تحديث الصورة الشخصية بنجاح!');
        }
    };
    reader.readAsDataURL(file);
}

/* ==========================================================================
   3. تأثيرات التمرير والهيدر والشريط العلوي
   ========================================================================== */
function initScrollEffects() {
    const header = document.getElementById('mainHeader');
    const progressBar = document.getElementById('scrollProgressBar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // تصغير الهيدر
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // شريط تقدم القراءة
        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progressPercent = (scrollY / totalHeight) * 100;
                progressBar.style.width = `${progressPercent}%`;
            }
        }

        // تحديد الرابط النشط تلقائياً
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, { passive: true });
}

/* ==========================================================================
   4. تأثير الكتابة الآلية في الهيرو (Typing Animation)
   ========================================================================== */
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const titles = [
        'مهندس تقنية معلومات ومطور مواقع',
        'مُدرّس ومدرّب تقني معتمد',
        'خبير صيانة وبرمجة الهواتف الذكية',
        'مختص صناعة السير الذاتية الاحترافية',
        'مستشار تسويق رقمي ورفع المبيعات',
        'مصمم هويات بصرية وتصاميم فنية'
    ];

    let currentTitleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const fullText = titles[currentTitleIndex];

        if (isDeleting) {
            typingElement.textContent = fullText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typingElement.textContent = fullText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 95;
        }

        if (!isDeleting && charIndex === fullText.length) {
            isDeleting = true;
            typingSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ==========================================================================
   5. عداد الإحصائيات الرقمية (Counter Animation)
   ========================================================================== */
function initCounterAnimation() {
    const statsContainer = document.querySelector('.hero-stats');
    const counters = document.querySelectorAll('.stat-number');
    if (!statsContainer || counters.length === 0) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 1600;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const timer = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 3)));
                        counter.textContent = currentVal;

                        if (frame >= totalFrames) {
                            counter.textContent = target;
                            clearInterval(timer);
                        }
                    }, frameDuration);
                });
            }
        });
    }, { threshold: 0.2 });

    observer.observe(statsContainer);
}

/* ==========================================================================
   6. تحريك أشرطة المهارات عند التمرير (Progress Bars)
   ========================================================================== */
function initSkillBars() {
    const skillsSection = document.getElementById('skills');
    const progressBars = document.querySelectorAll('.progress-bar');
    if (!skillsSection || progressBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const width = bar.getAttribute('data-width');
                    if (width) {
                        bar.style.width = width;
                    }
                });
                observer.unobserve(skillsSection);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(skillsSection);
}

/* ==========================================================================
   7. قائمة الموبايل التفاعلية (Mobile Nav Menu)
   ========================================================================== */
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDropdown = document.getElementById('mobileMenuDropdown');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileBtn || !mobileDropdown) return;

    function toggleMenu() {
        const isOpen = mobileDropdown.classList.contains('open');
        if (isOpen) {
            mobileDropdown.classList.remove('open');
            mobileBtn.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        } else {
            mobileDropdown.classList.add('open');
            mobileBtn.classList.add('active');
            mobileBtn.setAttribute('aria-expanded', 'true');
        }
    }

    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileDropdown.classList.remove('open');
            mobileBtn.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!mobileDropdown.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileDropdown.classList.remove('open');
            mobileBtn.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ==========================================================================
   8. فلترة المشاريع التفاعلية (Project Filters)
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    
                    setTimeout(() => {
                        card.style.transition = 'all 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 40);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   بيانات المشاريع للنافذة المنبثقة (Projects Modal Details)
   ========================================================================== */
const projectsDatabase = {
    'ibb-project': {
        title: 'الموقع السياحي لمحافظة إب الخضراء',
        category: 'مواقع ويب ومنصات استكشافية',
        badge: 'مشروع سياحي ريادي',
        description: 'منصة ويب تفاعلية متكاملة تسلط الضوء على المعالم السياحية الخلابة في محافظة إب، لواء الأخضر. يقدم الموقع دليلاً سياحياً مفصلاً للمتنزهات، الشلالات، القلاع التاريخية، والفنادق والمطاعم، مع خريطة إلكترونية تفاعلية للمواقع.',
        features: [
            'دليل سياحي وجغرافي تفاعلي لأبرز معالم ووديان محافظة إب.',
            'واجهة مستخدم بصرية مستوحاة من الطبيعة الخضراء وتجربة تصفح سريعة وسلسة.',
            'دعم التصفح الكامل على الهواتف الذكية مع إمكانية تحديد المواقع.',
            'قسم مخصص للنصائح السياحية وحالة الطقس وخدمات الإقامة والضيافة.'
        ],
        technologies: ['HTML5', 'CSS3 Modern', 'JavaScript Vanilla', 'Interactive Map APIs', 'Responsive UI/UX'],
        link: '#contact'
    },
    'web-suite': {
        title: 'سلسلة مواقع إلكترونية متكاملة للأعمال والمتاجر',
        category: 'تطوير أعمال ومتاجر رقمية',
        badge: 'حلول تجارية متكاملة',
        description: 'مجموعة من المواقع والمنصات المصممة خصيصاً للشركات ورواد الأعمال، تتيح عرض المنتجات والخدمات، واستقبال طلبات الشراء، وحجز المواعيد مع تكامل كامل مع وسائل الدفع والتواصل المباشر.',
        features: [
            'سرعة تحميل فائقة وتوافق 100% مع معايير محركات البحث (SEO).',
            'لوحة تحكم مرنة لإدارة المحتوى والمنتجات والطلبات بسهولة.',
            'تكامل مباشر مع إشعارات واتساب لخدمة العملاء الفورية.',
            'تصاميم فاخرة تعكس هوية الشركة وموثوقيتها.'
        ],
        technologies: ['Full Web Architecture', 'Responsive Layouts', 'REST APIs', 'SEO Optimization'],
        link: '#contact'
    },
    'repair-sys': {
        title: 'نظام إدارة ومتابعة ورش ومراكز صيانة الهواتف',
        category: 'أنظمة إدارة داخلية وحلول أعمال',
        badge: 'نظام برمجي تقني',
        description: 'نظام رقمي سحابي متطور مخصص لمراكز صيانة الهواتف والأجهزة الذكية، يقوم بأتمتة كافة مراحل استلام الجهاز، الفحص الفني، تحديد الأعطال (سوفت وير وهارد وير)، وربط المخزون بقطع الغيار.',
        features: [
            'إصدار فواتير وسندات استلام إلكترونية برمز QR لمتابعة حالة الجهاز.',
            'إرسال إشعارات تلقائية للعملاء عبر الرسائل والواتساب فور انتهاء الصيانة.',
            'إدارة دقيقة لمخزون قطع الغيار والشاشات وحساب الأرباح الشهرية.',
            'سجل تاريخي كامل لكل جهاز تم صيانة لضمان الجودة وخدمة الضمان.'
        ],
        technologies: ['Database Management', 'UI Dashboard', 'Barcode & QR Tracking', 'WhatsApp Automation'],
        link: '#contact'
    },
    'marketing-project': {
        title: 'حملة تسويقية متكاملة وتطوير الهوية التجارية',
        category: 'تسويق رقمي وهوية بصرية',
        badge: 'نمو مبيعات بنسبة 180%',
        description: 'مشروع تسويقي متكامل شمل إعادة تصميم الهوية البصرية للعلامة التجارية، وإطلاق حملات إعلانية ممولة دقيقة الاستهداف على منصات التواصل الاجتماعي، مما ساهم في تحقيق قفزة نوعية في المبيعات والوصول للجمهور المستهدف.',
        features: [
            'تصميم دليل هوية بصرية كامل (شعار، ألوان، خطوط، وقوالب إعلانية).',
            'إعداد استراتيجية محتوى ترويجي استهدف عملاء ذوي نية شراء عالية.',
            'إدارة الإعلانات الممولة وتحسين تكلفة النقرة والتحويل (CPA & ROI).',
            'تقارير تحليلية أسبوعية وشهرية لقياس مؤشرات الأداء والنمو.'
        ],
        technologies: ['Digital Marketing', 'Graphic & UI Design', 'Ads Management', 'Data Analytics'],
        link: '#contact'
    }
};

/* فتح نافذة تفاصيل المشروع */
function openProjectModal(projectId) {
    const data = projectsDatabase[projectId];
    if (!data) return;

    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    if (!modal || !modalContent) return;

    let featuresHtml = '';
    data.features.forEach(feat => {
        featuresHtml += `
            <div class="modal-feature-item">
                <i class="fa-solid fa-circle-check"></i>
                <span>${feat}</span>
            </div>
        `;
    });

    let techHtml = '';
    data.technologies.forEach(tech => {
        techHtml += `<span class="tag">${tech}</span>`;
    });

    modalContent.innerHTML = `
        <div class="modal-header-section">
            <span class="modal-category-tag">${data.category}</span>
            <h3 class="modal-title">${data.title}</h3>
        </div>
        <p class="project-summary">${data.description}</p>
        
        <h4 style="font-weight: 700; margin-top: 1.2rem; color: var(--text-primary); font-size: 1rem;">أبرز مميزات المشروع:</h4>
        <div class="modal-features-list">
            ${featuresHtml}
        </div>

        <h4 style="font-weight: 700; margin-top: 1.2rem; color: var(--text-primary); font-size: 1rem;">التقنيات المستخدمة:</h4>
        <div class="project-tags" style="margin-top: 0.5rem;">
            ${techHtml}
        </div>

        <div class="modal-actions-bar">
            <a href="#contact" onclick="closeProjectModal()" class="btn btn-primary">
                <i class="fa-solid fa-comments"></i>
                <span>اطلب مشروعاً مشابهاً</span>
            </a>
            <button onclick="closeProjectModal()" class="btn btn-glass">
                <span>إغلاق</span>
            </button>
        </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

/* إغلاق نافذة تفاصيل المشروع */
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

/* ==========================================================================
   9. نسخ النصوص وإظهار التنبيه السريع (Toast & Copy)
   ========================================================================== */
function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg || 'تم نسخ النص إلى الحافظة بنجاح!');
        }).catch(() => {
            fallbackCopyText(text, successMsg);
        });
    } else {
        fallbackCopyText(text, successMsg);
    }
}

function fallbackCopyText(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(successMsg || 'تم النسخ بنجاح!');
    } catch (err) {
        showToast('تعذر النسخ التلقائي، يمكنك نسخه يدوياً');
    }
    document.body.removeChild(textArea);
}

function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ==========================================================================
   10. معالجة إرسال استمارة التواصل (Contact Form Handler)
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();

    if (!name || !phone || !message) {
        showToast('يرجى ملء جميع الحقول الإلزامية المطلوبة');
        return;
    }

    if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جاري إرسال رسالتك...</span>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHtml;
            form.reset();
            showToast(`شكراً لك ${name}، تم إرسال رسالتك بنجاح وسأرد عليك قريباً!`);
        }, 1200);
    }
}

/* ==========================================================================
   11. طباعة أو حفظ السيرة الذاتية (Save / Print CV)
   ========================================================================== */
function printOrSavePortfolio() {
    showToast('جاري تجهيز السيرة الذاتية للطباعة والحفظ...');
    setTimeout(() => {
        window.print();
    }, 400);
}

/* ==========================================================================
   12. تحديث السنة الحالية في الفوتر
   ========================================================================== */
function initFooterYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
