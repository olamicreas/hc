const transitionLeavePage = (data) => {
    const currentContainer = data.current.container;
    $('.success-wrap').removeClass('show');
    $('.cursor-large').removeClass('hover toggle');
    gsap.to('.cursor-large', { width: '32px', height: '32px', duration: .2 })
    console.log("leavingTransition");
    pathW = $(window).width();
    pathH = $(window).height();
    const tlLeave = gsap.timeline();
    tlLeave.set(".page-trans-wrap", { autoAlpha: 1, 'clip-path': `path('m 0 ${pathH * 2} v -${pathH / 2} q ${pathW / 2} -${pathH / 2} ${pathW} 0 v ${pathH / 2} z')` })
        .set(".page-trans-main", { autoAlpha: 1 }, 0)
        .set(".page-trans-mask", { autoAlpha: 0 }, 0)
        .fromTo(currentContainer, { y: '0px', duration: 0.6 }, { y: '-200px' })
        .fromTo(
            ".page-trans-wrap",
            { 'clip-path': `path('m 0 ${pathH * 2} v -${pathH / 2} q ${pathW / 2} -${pathH / 2} ${pathW} 0 v ${pathH / 2} z')`, duration: 0.6, delay: 0.2, ease: 'power2.in' },
            { 'clip-path': `path('m 0 ${pathH * 2} v -${pathH * 2} q ${pathW / 2} 0 ${pathW} 0 v ${pathH * 2} z')` },
            0
        )
        .to(
            ".page-trans-mask",
            { autoAlpha: 1, duration: 0.4, delay: 0.2 },
            0
        )
    return tlLeave;
};
const transitionEnterPage = (data) => {
    const nextContainer = data.next.container;
    pathW = $(window).width();
    pathH = $(window).height();
    console.log("enteringTransition");
    const tlEnter = gsap.timeline({
        delay: .8,
        onStart: () => {
            window.scrollTo(0, 0);
            if (data.next.namespace == 'home') {
                transToHome();
            } else if (data.next.namespace == 'about') {
                console.log('trans to about')
                transToAbout();
            }
        }
    });
    tlEnter.set('.page-trans-wrap', { 'clip-path': `path('m 0 -${pathH} v ${pathH * 2} q ${pathW / 2} 0 ${pathW} 0 v -${pathH * 2} z')` })
        .to(".page-trans-wrap", { 'clip-path': `path('m 0 -${pathH} v ${pathH / 2} q ${pathW / 2} ${pathH} ${pathW} 0 v -${pathH / 2} z')`, duration: 0.6 }, 0)
        .to(
            ".page-trans-mask",
            { autoAlpha: 0, duration: 0.6, ease: 'power2.out', delay: -0.2 },
            0
        )
        .from(nextContainer, { y: '100', duration: 0.6, delay: -0.2 }, 0)
        .set(".page-trans-wrap", { autoAlpha: 0, 'clip-path': `path('m 0 ${pathH * 2} v -${pathH / 2} q ${pathW / 2} -${pathH / 2} ${pathW} 0 v ${pathH / 2} z')` })
        .set(".page-trans-mask", { autoAlpha: 0, });
    return tlEnter;
};

//barba hooks
barba.hooks.beforeLeave(() => {
    let triggers = ScrollTrigger.getAll();
    triggers.forEach(trigger => {
        trigger.kill();
    });
});
barba.hooks.after(() => {
});
barba.hooks.once(() => {
    setTimeout(() => {
        pathW = $(window).width();
        pathH = $(window).height();
        introLoad(pathW, pathH);
    }, 1000)
});

//barba init
barba.init({
    sync: true,
    timeout: 5000,
    transitions: [
        {
            once(data) {
                window.scrollTo(0, 0);
                $('.hubspot-wrap').addClass('show');
                $('.page-trans-wrap').addClass('active');
                $('.cursor-wrap').css('z-index', '1002');
                detectLinks(data.next.namespace);
                checkHubspotTag(data);
                check404(data);

            },
            async beforeLeave(data) {
                $('.page-trans-wrap').addClass('active');
            },
            async afterLeave(data) {
                //when leave
                const done = this.async();
                animCloseMenu(pathW, pathH);
                const tlAfter = transitionLeavePage(data);
                tlAfter.then(() => {
                    done();
                    resetHovers();
                });
            },
            async enter(data) {
                //when enter
                console.log('enter')
                check404(data);
                window.scrollTo(0, 0);
                checkHubspotTag(data);
                $('.header').addClass('show');
                const tlEnter = transitionEnterPage(data);
                tlEnter.then(() => {
                    detectLinks(data.next.namespace);
                    initHovers();
                });
            },
            async afterEnter(data) {
            },
            async beforeEnter(data) {
                window.scrollTo(0, 0);
            },
            async after(data) {
            }
        },
    ],
    views: [
        {
            namespace: "home",
            afterEnter() {
                //homeScript();
            }
        },
        {
            namespace: "about",
            afterEnter() {
                //aboutScript();
            }
        },
        {
            namespace: "approach",
            afterEnter() {
                approachScript();
            },
        },
        {
            namespace: "service",
            afterEnter() {
                serviceScript();
            }
        },
        {
            namespace: "contact",
            afterEnter() {
                contactScript();
            }
        },
        {
            namespace: "404",
            afterEnter() {
                notFoundScript();
            }
        },
        {
            namespace: "term",
            afterEnter() {
                termScript();
            }
        },
        {
            namespace: "privacy",
            afterEnter() {
                termScript();
            }
        }
    ],
});

//Global ultilities functions
let pathW = $(window).width();
let pathH = $(window).height();
CustomEase.create("easeAnim", ".5,-0.01,.38,.99");

//Handle Header
let lastScrollTop = 0;
$(window).on('scroll', (e) => {
    let st = $(this).scrollTop();
    if (st > lastScrollTop) {
        //down
        if (st > $('.header').outerHeight()) {
            $('header').removeClass('show');
            $('.menu-toggle').removeClass('hide');
            $('.header-links').addClass('hide');
        } else {
            $('.header').addClass('show');
            $('.menu-toggle').addClass('hide');
            $('.header-links').removeClass('hide');
        }
    } else {
        //up
        $('.header').addClass('show');
        if (st < $('.header').outerHeight()) {
            $('.menu-toggle').addClass('hide');
            $('.header-links').removeClass('hide');
        } else {
            $('.menu-toggle').removeClass('hide');
            $('.header-links').addClass('hide');
        }
    }
    lastScrollTop = st;
})
function handleTermScroll() {
    console.log('term scroll')
    let lastScrollTop = 0;
    let stickyele = $('[data-stick]');
    let stickyeleTop = parseInt(stickyele.css('top'));
    $(window).on('scroll', (e) => {
        let st = $(this).scrollTop();
        if (st > lastScrollTop) {
            //down
            stickyele.css('top', `${stickyeleTop}px`);
        } else {
            //up
            stickyele.css('top', `${stickyeleTop + 60}px`);
        }
        lastScrollTop = st;
    })
}

function check404(data) {
    if (data.next.namespace == "404") {
        $('.header').addClass('is-404')
    } else {
        $('.header').removeClass('is-404')
    }
}
let isLockedScroll = false;
function lockScroll() {
    if (isLockedScroll) return;
    isLockedScroll = true;
    console.log('lockScroll')
    $html = $('html');
    $body = $('body');
    let initWidth = $body.outerWidth();
    let initHeight = $body.outerHeight();
    let scrollPosition = [
        self.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft,
        self.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop,
    ];
    $html.data('scroll-position', scrollPosition);
    $html.data('previous-overflow', $html.css('overflow'));
    $html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    let marginR = $body.outerWidth() - initWidth;
    let marginB = $body.outerHeight() - initHeight;
    $body.css({ 'margin-right': marginR, 'margin-bottom': marginB });
}
function unlockScroll() {
    if (!isLockedScroll) return;
    isLockedScroll = false;
    console.log('unlockScroll')
    $html = $('html');
    $body = $('body');
    $html.css('overflow', $html.data('previous-overflow'));
    let scrollPosition = $html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
    $body.css({ 'margin-right': 0, 'margin-bottom': 0 });
}

function clearActive() {
    $('[data-link]').removeClass('active');
}
function detectLinks(curPage) {
    clearActive();
    $(`[data-link="${curPage}"]`).addClass('active');
}

//Magic cursor
let isStuck = false;
let lastX = 0;
let lastY = 0;
let stuckX = 0;
let stuckY = 0;
let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor-large");

const initCursor = () => {
    // add listener to track the current mouse position
    document.addEventListener("pointermove", e => {
        if (!isStuck) {
            // move circle around normally
            lastX = e.clientX;
            lastY = e.clientY;
        } else if (isStuck) {
            // fixed position on a nav item
            lastX = stuckX;
            lastY = stuckY;
        }
    });
    const xSet = gsap.quickSetter(innerCursor, "x", "px");
    const ySet = gsap.quickSetter(innerCursor, "y", "px");
    const render = () => {
        // gsap.quickSetter(innerCursor, {
        //   x: lastX,
        //   y: lastY
        // });
        xSet(lastX);
        ySet(lastY);

        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
};
initCursor();

function moveMagnet(event) {
    console.log(event.target.classList.contains('appr-obs-main-item'));
    if (event.target.classList.contains('appr-obs-main-item') || event.target.classList.contains('appr-axd-main-item')) {
        innerCursor.classList.add('hidden');
    }

    var magnetButton = event.currentTarget;
    var bounding = magnetButton.getBoundingClientRect();
    var magnetsStrength = magnetButton.getAttribute("data-strength");
    var magnetsStrengthText = magnetButton.getAttribute("data-strength-text");

    gsap.to(magnetButton, 1.5, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
        rotate: "0.001deg",
        ease: Power4.easeOut
    });
    if ($(this).find("[data-inner]").length) {
        gsap.to($(this).find("[data-inner]"), 1.5, {
            x: 6 + (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrengthText,
            y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrengthText,
            rotate: "0.001deg",
            ease: Power4.easeOut
        });
    };
    gsap.to($('.cursor-inner'), 1.5, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * 25,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * 25,
        rotate: "0.001deg",
        ease: Power4.easeOut
    });
}
function outMagnet(event) {
    innerCursor.classList.remove('hidden');
    gsap.to(event.currentTarget, 1.5, {
        x: 0,
        y: 0,
        ease: Elastic.easeOut
    });
    if ($(this).find("[data-inner]").length) {
        gsap.to($(this).find("[data-inner]"), 1.5, {
            x: 0,
            y: 0,
            ease: Elastic.easeOut
        });
    }
    gsap.to($('.cursor-inner'), 1.5, {
        x: 0,
        y: 0,
        ease: Elastic.easeOut
    });
}
const initHovers = () => {
    if (window.innerWidth > 768) {
        gsap.to('.cursor-wrap', { autoAlpha: 1, duration: .3 });
        const handleMouseEnter = e => {
            console.log('hover')
            const navItem = e.currentTarget;
            const navItemBox = navItem.getBoundingClientRect();
            const navType = navItem.getAttribute('data-cursor');
            $('.cursor-large').addClass('hover');
            if (navType == 'btn-lg') {
                stuckX = Math.round(navItemBox.left + 30)
                gsap.to('.cursor-large.hover', { width: `${6}px`, height: `${6}px`, duration: .3, ease: "power3.inOut" })
            } else if (navType == 'btn-sm') {
                stuckX = Math.round(navItemBox.left + 18);
                gsap.to('.cursor-large.hover', { width: `${4}px`, height: `${4}px`, duration: .3, ease: "power3.inOut" })
            } else if (navType == 'toggle') {
                $('.cursor-large').addClass('toggle');
                stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
                gsap.to('.cursor-large.hover', { width: `${62}px`, height: `${62}px`, duration: .3, ease: "power3.inOut" })
            } else if (navType == 'text-link') {
                stuckX = Math.round(navItemBox.left - 10);
                gsap.to('.cursor-large.hover', { width: `${4}px`, height: `${4}px`, duration: .3, ease: "power3.inOut" })
            } else if (navType == 'text-nav') {
                stuckX = Math.round(navItemBox.left - 24);
                gsap.to('.cursor-large.hover', { width: `${10}px`, height: `${10}px`, duration: .3, ease: "power3.inOut" })
            }
            stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
            isStuck = true;
        };
        function initMagneticButtons() {
            // Magnetic Buttons
            let magnets = document.querySelectorAll('[data-magnetic]');
            // Mouse Reset
            magnets.forEach((magnet) => {
                magnet.addEventListener('pointermove', moveMagnet);
                magnet.addEventListener('pointerleave', outMagnet);
            });
            // END : If screen is bigger as 540 px do magnetic
        };
        initMagneticButtons();
        // reset isStuck on mouseLeave
        const handleMouseLeave = e => {
            isStuck = false;
            const navItem = e.currentTarget;
            const navType = navItem.getAttribute('data-cursor');
            if (navType == 'toggle') {
                $('.cursor-large').removeClass('toggle');
            }
            $('.cursor-large').removeClass('hover');
            gsap.to('.cursor-large', { width: '32px', height: '32px', duration: .2 })
        };
        // add event listeners to all items
        const linkItems = $("[data-cursor]");
        linkItems.on("pointerenter", handleMouseEnter);
        linkItems.on("pointerleave", handleMouseLeave);
    }
};
const resetHovers = () => {
    gsap.to('.cursor-wrap', { autoAlpha: 0, duration: .3 });
    const linkItems = $("[data-cursor]");
    linkItems.off("pointerenter");
    linkItems.off("pointerleave");
    $('.cursor-large').removeClass('hover');
    $('.cursor-large').removeClass('toggle');
    gsap.to('.cursor-large', { width: '32px', height: '32px', duration: .2 })
    let magnets = document.querySelectorAll('[data-magnetic]');
    magnets.forEach((magnet) => {
        magnet.removeEventListener('pointermove', moveMagnet);
        magnet.removeEventListener('pointerleave', outMagnet);
    })
}

//Handle Layout
function checkHubspotTag(data) {
    if (data.next.namespace == 'home') {
        $('.hubspot-wrap').removeClass('hidden');
    } else {
        $('.hubspot-wrap').addClass('hidden');
    }
}
//Handle Header
gsap.set('.nav', { 'clip-path': `path('m 0 -${pathH} v ${pathH / 2} q ${pathW / 2} ${pathH} ${pathW} 0 v -${pathH / 2} z')`, duration: 1, ease: 'easeAnim' });

$('.menu-toggle').on('click', (e) => {
    e.preventDefault();
    pathW = $(window).width();
    pathH = $(window).height();
    if ($(e.target).hasClass('active')) {
        animCloseMenu(pathW, pathH);
    } else {
        animOpenMenu(pathW, pathH);
    }
});

function animOpenMenu(pW, pH) {
    lockScroll()
    $('.menu-toggle').addClass('active');
    $('.nav').addClass('active');
    gsap.set('.nav', { 'clip-path': `path('m 0 -${pH} v ${pH / 2} q ${pW / 2} ${pH} ${pW} 0 v -${pH / 2} z')`, ease: 'easeAnim' });
    gsap.to('.nav', { 'clip-path': `path('m 0 -${pH} v ${pH * 2} q ${pW / 2} 0 ${pW} 0 v -${pH * 2} z`, duration: 1, ease: 'easeAnim' });
    gsap.from('.nav-inner .nav-link', { y: '200%', autoAlpha: 0, duration: .6, stagger: .05, clearProps: 'all', delay: .4, ease: 'easeAnim' })
}
function animCloseMenu(pW, pH) {
    unlockScroll()
    $('.menu-toggle').removeClass('active');
    $('.nav').removeClass('active');
    gsap.to('.nav', { 'clip-path': `path('m 0 -${pH} v ${pH / 2} q ${pW / 2} ${pH} ${pW} 0 v -${pH / 2} z')`, duration: 1, ease: 'easeAnim', delay: '0.1' });
    gsap.set('.nav-inner .nav-link', { y: '0px', autoAlpha: .6, ease: 'easeAnim' })
    gsap.to('.nav-inner .nav-link', { y: '200%', autoAlpha: 0, duration: .6, stagger: -.05, clearProps: 'all', ease: 'easeAnim' })
}
//Intro functions
function introLoad(pW, pH) {
    window.scrollTo(0, 0);
    lockScroll();
    if ($('.homepage').length) {
        lockScroll();
        $('.sky-wrap').removeClass('hidden');
        const tlHomeHeroSet = new gsap.timeline({
            onStart: () => {
                console.log('home set')
            }
        });
        tlHomeHeroSet.set('.home-hero-sun', { y: 250, autoAlpha: 0 })
            .set('.home-hero-mountain', { y: -60 }, '0')
            .set('.home-hero-planets', { y: 100 }, '0')
    } else if ($('.aboutpage').length) {
        $('.sky-wrap').removeClass('hidden');
        lockScroll();
        const tlAbtHeroSet = new gsap.timeline({
            onStart: () => {
                console.log('about set')
            }
        });
        tlAbtHeroSet.set('.abt-hero-bg-main', { yPercent: 20, autoAlpha: 0 })
    }

    const tlIntroLoad = new gsap.timeline({
    });
    tlIntroLoad.set('.loading-wrap', { 'clip-path': `path('m 0 -${pH} v ${pH * 2} q ${pW / 2} 0 ${pW} 0 v -${pH * 2} z` })
        .to('.loading-wrap', { 'clip-path': `path('m 0 -${pH} v ${pH / 2} q ${pW / 2} ${pH} ${pW} 0 v -${pH / 2} z')`, duration: 1, ease: 'easeAnim', delay: 1 }, '0')
        .to('.loading-main', { autoAlpha: 0, duration: 1, delay: .8 }, '0');

    setTimeout(() => {
        $('.loading-wrap').addClass('hidden');
    }, 2000);

    setTimeout(() => {
        unlockScroll();
        initHovers();
        if ($('.homepage').length) {
            console.log('done intro and at home')
            const tlHomeHeroAfterIntro = new gsap.timeline({
                onComplete: () => {
                    unlockScroll();
                    console.log('unlock at intro')
                    const tlHomeHero = new gsap.timeline({
                        scrollTrigger: {
                            trigger: '.sc-home-hero',
                            scrub: 0.4,
                            start: "top top",
                            end: "bottom top",
                        }
                    });
                    tlHomeHero.to('.home-hero-mountain', { yPercent: 8, ease: 'none' })
                        .to('.home-hero-man', { yPercent: 5, ease: 'none' }, '0')
                        .to('.home-hero-sun', { yPercent: -6, ease: 'none' }, '0')
                        .to('.home-hero-planets', { yPercent: -16, ease: 'none' }, '0')

                    homeScript();
                }
            })
            tlHomeHeroAfterIntro.to('.home-hero-sun', { y: 0, autoAlpha: 1, duration: 1.4, ease: "Power1.easeOut" })
                .to('.home-hero-mountain', { y: 0, duration: 1.4, ease: "Power1.easeOut" }, '0')
                .to('.home-hero-planets', { y: 0, duration: 1.4, ease: "Power1.easeOut" }, '0')
        } else if ($('.aboutpage').length) {
            if ($('.aboutpage').length) {
                console.log('done transition and at about')
                const tlAboutHeroAfterIntro = new gsap.timeline({
                    onComplete: () => {
                        unlockScroll();
                        aboutScript();
                    }
                })
                tlAboutHeroAfterIntro.to('.abt-hero-bg-main', { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: "Power1.easeOut" })
            }
        }
    }, 1400)
}

//Page Script

function transToHome() {
    if ($('.homepage').length) {
        lockScroll();
        $('.sky-wrap').removeClass('hidden');
        const tlHomeHeroSet = new gsap.timeline({
            onStart: () => {
                console.log('home set')
            }
        });
        tlHomeHeroSet.set('.home-hero-sun', { y: 250, autoAlpha: 0 })
            .set('.home-hero-mountain', { y: -60 }, '0')
            .set('.home-hero-planets', { y: 100 }, '0')
    }

    setTimeout(() => {
        if ($('.homepage').length) {
            console.log('done transition and at home')
            const tlHomeHeroAfterIntro = new gsap.timeline({
                onComplete: () => {
                    unlockScroll();
                    console.log('unlock at after transition')
                    const tlHomeHero = new gsap.timeline({
                        scrollTrigger: {
                            trigger: '.sc-home-hero',
                            scrub: 0.4,
                            start: "top top",
                            end: "bottom top",
                        }
                    });
                    tlHomeHero.to('.home-hero-mountain', { yPercent: 8, ease: 'none' })
                        .to('.home-hero-man', { yPercent: 5, ease: 'none' }, '0')
                        .to('.home-hero-sun', { yPercent: -6, ease: 'none' }, '0')
                        .to('.home-hero-planets', { yPercent: -16, ease: 'none' }, '0')

                    homeScript();
                }
            })
            tlHomeHeroAfterIntro.to('.home-hero-sun', { y: 0, autoAlpha: 1, duration: 1.4, ease: "Power1.easeOut" })
                .to('.home-hero-mountain', { y: 0, duration: 1.4, ease: "Power1.easeOut" }, '0')
                .to('.home-hero-planets', { y: 0, duration: 1.4, ease: "Power1.easeOut" }, '0')
        }
    }, 0)
}

function homeScript() {
    if ($('.homepage').length) {
        console.log('Welcome to homepage');
        $('.home-hero-planet-1, .home-hero-planet-2').addClass('animate');
        $('.home-trans-item').on('mouseover', (e) => {
            e.preventDefault();
            let target = $(e.target).data('trans');
            $('.home-trans-item-img').removeClass('show');
            $(`.home-trans-item-img[data-trans=${target}]`).addClass('show');
            const tlHoverBounce = new gsap.timeline({});
            tlHoverBounce.to('.home-trans-planet', { scale: 0.8, autoAlpha: .8, duration: .2, ease: 'none' })
                .to('.home-trans-planet', { scale: 1, autoAlpha: 1, duration: .3, ease: Elastic.easeOut })
                .to('.home-trans-item-img', { scale: .8, duration: .2, ease: 'none' }, 0)
                .to('.home-trans-item-img', { scale: 1, duration: .3, ease: Elastic.easeOut }, .2)
        });

        function homeRevOnScroll() {
            // const tlHomeFocus = new gsap.timeline({
            //     scrollTrigger: {
            //         trigger: '.sc-home-focus',
            //         scrub: 0.4,
            //         start: "top top",
            //         end: "200% top",
            //     }
            // })
            // tlHomeFocus.to('.home-focus-shards .shard', { top: '50%', left: '50%', autoAlpha: 0.2, scale: 0.1, stagger: 0, ease: 'none' })
            //gsap.to('.home-focus-shards .shard', { top: '50%', left: '50%', autoAlpha: 0.2, scale: 0.1, stagger: 0, ease: 'none', repeat: -1, duration: .5 })

            if ($(window).width() > 479) {
                const tlHomeAutoBg = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.sc-home-auto',
                        scrub: 0.4,
                        start: "top top",
                        end: "bottom top",
                    }
                })
                tlHomeAutoBg.to('.home-auto-fg-img', { yPercent: -20, ease: 'none' })
                    .to('.home-auto-bg-img', { yPercent: -10, each: 'none' }, '0')
            }

            let txtHomeFocusSub = new SplitText('.home-focus-sub', { type: 'lines' });
            const tlHomeFocusRev = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-home-focus',
                    start: "top 65%",
                },
                onComplete: () => {
                    txtHomeFocusSub.revert();
                }
            })
            tlHomeFocusRev.from('.home-focus-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' })
                .from('.home-focus-title', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from('.home-focus-subtitle', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtHomeFocusSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, stagger: 0.1 }, '-=.3')
                .from('.home-focus-btn', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3');

            let txtHomeTransTitle = new SplitText('.home-trans-title', { type: 'lines' });
            let txtHomeTransSub = new SplitText('.home-trans-sub', { type: 'lines' });
            const tlHomeTrans = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-home-trans',
                    start: "top 65%",
                },
                onComplete: () => {
                    txtHomeTransTitle.revert()
                    txtHomeTransSub.revert()
                }
            })
            tlHomeTrans.from(txtHomeTransTitle.lines, { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: .1 })
                .from(txtHomeTransSub.lines, { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: .1 }, '-=.3')
                .from('.home-trans-btn', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')

            let homeTransItems = $('.home-trans-item');
            for (x = 0; x < homeTransItems.length; x++) {
                let txtTransItemSub = new SplitText($('.trans-item-sub').eq(x), { type: 'lines' })
                const tlHomeTransItem = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.sc-home-trans',
                        start: 'top 65%',
                    },
                    onComplete: () => {
                        txtTransItemSub.revert();
                    }
                });
                tlHomeTransItem.from($('.home-trans-item .trans-item-step').eq(x), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all', delay: `${x * .2}` })
                    .from($('.home-trans-item .trans-item-title').eq(x), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                    .from(txtTransItemSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, stagger: 0.1 }, '-=.3')
            };

            let txtHomeAutoSub = new SplitText('.home-auto-sub', { type: 'lines' });
            const tlHomeAuto = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-home-auto',
                    start: "top 65%",
                },
                onComplete: () => {
                    txtHomeAutoSub.revert()
                }
            });
            tlHomeAuto.from('.home-auto-label', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' })
                .from('.home-auto-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from('.home-auto-title', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtHomeAutoSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, stagger: 0.1 }, '-=.3')
                .from('.home-auto-btn', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3');


            let txtHomeTestiMainTitle = new SplitText('.home-testi-main-title', { type: 'lines' });
            let txtHomeTestiMainSub = new SplitText('.home-testi-main-txt', { type: 'lines' });
            const tlHomeTesti = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-home-testi',
                    start: 'top 65%',
                },
                onComplete: () => {
                    txtHomeTestiMainTitle.revert()
                    txtHomeTestiMainSub.revert()
                }
            });
            tlHomeTesti.from('.home-test-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' })
                .from('.testi-quote-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtHomeTestiMainTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, stagger: 0.1 }, '-=.3')
                .from(txtHomeTestiMainSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, stagger: 0.1 }, '-=.6')
                .from('.home-test-main-author img', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.6')
                .from('.home-testi-author-name', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.4')
                .from('.home-testi-job', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.4')

            let txtHomePartSub = new SplitText('.home-part-sub', { type: 'lines' })
            const tlHomePart = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-home-part',
                    start: 'top 65%',
                },
                onComplete: () => {
                    txtHomePartSub.revert()
                }
            });
            tlHomePart.from('.home-part-title', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' })
                .from(txtHomePartSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.home-part-item', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.6')

        };
        homeRevOnScroll();
    }
}

function transToAbout() {
    if ($('.aboutpage').length) {
        $('.sky-wrap').removeClass('hidden');
        lockScroll();
        const tlAbtHeroSet = new gsap.timeline({
            onStart: () => {
                console.log('about set')
            }
        });
        tlAbtHeroSet.set('.abt-hero-bg-main', { yPercent: 20, autoAlpha: 0 })
    }

    setTimeout(() => {
        if ($('.aboutpage').length) {
            console.log('done transition and at about')
            const tlAboutHeroAfterIntro = new gsap.timeline({
                onComplete: () => {
                    unlockScroll();
                    aboutScript();
                }
            })
            tlAboutHeroAfterIntro.to('.abt-hero-bg-main', { yPercent: 0, autoAlpha: 1, duration: 1.4, ease: "Power1.easeOut" })
        }
    }, 0)
}

function aboutScript() {
    if ($('.aboutpage').length) {
        console.log('Welcome to aboutpage');
        $('.abt-hubspot-main-overlay').css('z-index', '4');

        function doubleContent(side) {
            let inner = $(`.abt-hubspot-icons.${side}`).html();
            $(`.abt-hubspot-icons.${side}`).append(inner);
        }
        doubleContent('right');
        doubleContent('left');
        const tlAbtHubLeft = new gsap.timeline({
            repeat: -1,
        });
        tlAbtHubLeft.to('.abt-hubspot-inner.left', { xPercent: 100, duration: 20, ease: Linear.easeNone });

        const tlAbtHubRight = new gsap.timeline({
            repeat: -1,
        });
        tlAbtHubRight.to('.abt-hubspot-inner.right', { xPercent: -100, duration: 20, ease: Linear.easeNone });

        $('.abt-hubspot-icons.left').on('mouseover', (e) => {
            gsap.to(tlAbtHubLeft, { timeScale: 0, duration: 0.5 });
        });
        $('.abt-hubspot-icons.left').on('mouseleave', (e) => {
            gsap.to(tlAbtHubLeft, { timeScale: 1, duration: 0.5 });
        });
        $('.abt-hubspot-icons.right').on('mouseover', (e) => {
            gsap.to(tlAbtHubRight, { timeScale: 0, duration: 0.5 });
        });
        $('.abt-hubspot-icons.right').on('mouseleave', (e) => {
            gsap.to(tlAbtHubRight, { timeScale: 1, duration: 0.5 });
        });

        if ($(window).width() > 479) {
            const tlAbtValue = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.abt-value-main',
                    start: 'top 50%',
                    end: 'bottom bottom',
                },
            });
            tlAbtValue.from('[data-value=one]', { autoAlpha: 0, duration: 1, clearProps: 'all' })
                .from('[data-value=two]', { autoAlpha: 0, duration: 1, clearProps: 'all' }, '-=.4')
                .from('[data-value=three]', { autoAlpha: 0, duration: 1, clearProps: 'all' }, '-=.4')
                .from('[data-value=four]', { autoAlpha: 0, duration: 1, clearProps: 'all' }, '-=.4')
        }

        if ($(window).width() < 479) {
            const swiperAbtValueMb = new Swiper('.abt-value-main-mb', {
                slidesPerView: 1,
                spaceBetween: 24,
                pagination: {
                    el: '.swiper-pagination-abt-value',
                    type: 'bullets',
                },
            });
            swiperAbtValueMb.on('activeIndexChange', (e) => {
                $('.value-img-wrap img').removeClass('active');
                $(`.value-img-wrap img[data-value-mb=${e.activeIndex}]`).addClass('active');
            });
            const tlAbtValueMb = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.abt-value-main',
                    start: 'top 50%',
                    end: 'bottom bottom',
                },
            });
            tlAbtValueMb.from('.value-img-wrap', { autoAlpha: 0, duration: 1, clearProps: 'all' })
                .from('.abt-value-main .swiper-pagination-bullet', { y: 30, autoAlpha: 0, duration: .6, stagger: 0.1 }, '-=.4')
                .from('.value-item-title', { y: 40, autoAlpha: 0, duration: 1, clearProps: 'all' }, '-=.4')
                .from('.value-item-sub', { y: 40, autoAlpha: 0, duration: 1, clearProps: 'all' }, '-=.4')

        }

        function abtRevOnScroll() {
            // let txtAbtHeroTitle = new SplitText('.abt-hero-title', { type: 'lines' });
            // let txtAbtHeroSub = new SplitText('.abt-hero-sub', { type: 'lines' });
            // let txtAbtHeroContent = new SplitText('.abt-hero-content-title', { type: 'lines' });
            // let txtAbtHeroContentSub = new SplitText('.abt-hero-content-sub', { type: 'lines' });
            // const tlAbtHero = new gsap.timeline({
            //     scrollTrigger: {
            //         trigger: '.sc-abt-hero',
            //         start: 'top top',
            //     },
            //     onComplete: () => {
            //         txtAbtHeroTitle.revert()
            //         txtAbtHeroSub.revert()
            //         txtAbtHeroContent.revert()
            //         txtAbtHeroContentSub.revert()
            //     }
            // });
            // tlAbtHero.from(txtAbtHeroTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 })
            //     .from(txtAbtHeroSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
            //     .from(txtAbtHeroContent.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
            //     .from(txtAbtHeroContentSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')

            let txtAbtHsTitle = new SplitText('.abt-hubspot-title', { type: 'lines' });
            const tlAbtHs = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-abt-hubspot',
                    start: 'top 65%'
                },
                onComplete: () => {
                    txtAbtHsTitle.revert()
                }
            });
            tlAbtHs.from(txtAbtHsTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 })
                .from('.abt-hubspot-sub', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.abt-hubspot-icons', { autoAlpha: 0, duration: .6, stagger: .2 }, '-=.3')

            let txtAbtValTitle = new SplitText('.abt-value-title', { type: 'lines' });
            const tlAbtVal = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-abt-value',
                    start: 'top 65%'
                },
                onComplete: () => {

                }
            });
            tlAbtVal.from('.abt-value-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' })
                .from(txtAbtValTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.abt-value-btn', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')

            if ($(window).width() > 479) {
                const tlAbtValBg = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.sc-abt-value',
                        scrub: 0.4,
                        start: "top top",
                        end: "bottom top",
                    }
                })
                tlAbtValBg.to('.abt-value-bg', { y: -300, ease: 'none' })
            }

            let txtAbtTeamSub = new SplitText('.abt-team-sub', { type: 'lines' })
            const tlAbtTeam = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-abt-team',
                    start: 'top 65%'
                },
                onComplete: () => {
                    txtAbtTeamSub.revert()
                }
            });
            tlAbtTeam.from('.abt-team-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' })
                .from('.abt-team-title', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtAbtTeamSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')

            let abtTeamItems = $('.abt-team-item');
            for (x = 0; x < abtTeamItems.length; x++) {
                const tlAbtTeamItem = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.abt-team-main',
                        start: 'top 65%',
                    }
                });
                tlAbtTeamItem.from($('.abt-team-item .team-img-wrap').eq(x), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all', delay: `${x * .2}` })
                    .from($('.abt-team-item .team-name').eq(x), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                    .from($('.abt-team-item .team-job').eq(x), { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.4, clearProps: 'all' }, '-=.3')
            };
        };
        abtRevOnScroll();
    }
}

function approachScript() {
    if ($('.approachpage').length) {
        console.log('Welcome to approachpage');
        if ($(window).width() > 768) {
            $('.appr-obs-main-item').on('mouseover', (e) => {
                e.preventDefault();
                $(e.target).find('.appr-obs-title-txt').addClass('hide');
                $(e.target).find('.appr-obs-main-txt').addClass('show');
                gsap.to($(e.target).find('.appr-obs-main-item-bg'), { scale: 1.1, duration: 0.6, ease: Bounce.easeOut })
            });
            $('.appr-obs-main-item').on('mouseleave', (e) => {
                e.preventDefault();
                $(e.target).find('.appr-obs-title-txt').removeClass('hide');
                $(e.target).find('.appr-obs-main-txt').removeClass('show');
                gsap.to($(e.target).find('.appr-obs-main-item-bg'), { scale: 1, duration: 0.6, ease: Power1.easeOut, clearProps: 'all' })
            });
        }
        if ($(window).width() < 768) {
            const swiperApprObsMb = new Swiper('.swiper-appr-obs-mb', {
                slidesPerView: 1,
                spaceBetween: 32,
                breakpoints: {
                    479: {
                        slidesPerView: 2,
                        spaceBetween: 18
                    }
                }
            });
            const swiperApprXdaMb = new Swiper('.swiper-appr-xda-mb', {
                slidesPerView: 1,
                spaceBetween: 32,
                breakpoints: {
                    479: {
                        slidesPerView: 2,
                        spaceBetween: 18
                    }
                }
            });
        };
        if ($(window).width() < 479) {
            const swiperApprResultMb = new Swiper('.appr-result-main-wrap', {
                slidesPerView: 1,
                spaceBetween: 32,
            })
        }

        function apprRevOnScroll() {
            let txtApprObsTitle = new SplitText('.appr-obs-title', { type: 'lines' });
            const tlApprObs = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-appr-obs',
                    start: "top 65%",
                },
                onComplete: () => {
                    txtApprObsTitle.revert()
                }
            });
            tlApprObs.from(txtApprObsTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 })
                .from('.appr-obs-main .appr-obs-main-item', { yPercent: 60, autoAlpha: 0, ease: 'easeAnim', duration: 1, stagger: 0.1, clearProps: 'all' }, '-=.3')
                .from('.appr-obs-main .ball', { yPercent: 60, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'easeAnim' }, '0.4');

            let txtApprSolTitle = new SplitText('.appr-sol-title', { type: 'lines' });
            let txtApprSolMainTitle = new SplitText('.appr-sol-main-title', { type: 'lines' })
            const tlApprSol = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-appr-sol',
                    start: 'top 65%',
                },
                onComplete: () => {
                    txtApprSolTitle.revert()
                    txtApprSolMainTitle.revert()
                }
            })
            tlApprSol.from('.appr-sol-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' })
                .from(txtApprSolTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from(txtApprSolMainTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.appr-sol-main-bg', { autoAlpha: 0, duration: .8, ease: 'easeAnim' }, '<=.4')
                .from('.appr-sol-main-item-lg img', { autoAlpha: 0, duration: .6, stagger: 0.1, ease: 'easeAnim', clearProps: 'all' }, '-=.3')
                .from('.appr-sol-main-item-lg .h6', { autoAlpha: 0, duration: .6, stagger: 0.1, ease: 'easeAnim', clearProps: 'all' }, '<=0')
                .from('.appr-sol-main-item-sm img', { autoAlpha: 0, duration: .6, stagger: 0.1, ease: 'easeAnim', clearProps: 'all' }, '<=.3')
                .from('.appr-sol-main-item-sm .h6', { autoAlpha: 0, duration: .6, stagger: 0.1, ease: 'easeAnim', clearProps: 'all' }, '<=0')

            let txtApprAxdTitle = new SplitText('.appr-axd-title', { type: 'lines' })
            const tlApprAxd = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-appr-axd',
                    start: "top 65%",
                    end: "bottom top",
                },
                onComplete: () => {
                    txtApprAxdTitle.revert()
                }
            });
            tlApprAxd.from(txtApprAxdTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 })
                .from('.appr-axd-main .appr-axd-main-item', { yPercent: 60, autoAlpha: 0, ease: 'easeAnim', duration: 1, stagger: 0.1, clearProps: 'all' }, '-=.3')
                .from('.appr-axd-main .ball', { yPercent: 60, autoAlpha: 0, duration: 0.6, stagger: 0.05, ease: 'easeAnim', clearProps: 'all' }, '0.4')

            let txtApprResultSub = new SplitText('.appr-result-sub', { type: 'lines' })
            const tlApprResult = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-appr-result',
                    start: 'top 65%',
                },
                onComplete: () => {
                    txtApprResultSub.revert()
                }
            });
            tlApprResult.from('.appr-result-title-top', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' })
                .from('.appr-result-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' }, '-=.4')
                .from('.appr-result-title-bot', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.5')
                .from(txtApprResultSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.appr-result-main-item', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, stagger: .1, clearProps: 'all' }, '-=.3')
        };
        apprRevOnScroll();
    }
}

function serviceScript() {
    if ($('.servicepage').length) {
        console.log('Welcome to servicepage');
        $('.sky-wrap').removeClass('hidden');
        $('.ser-faq-item').removeClass('active');
        $('.ser-faq-item-ques').removeClass('active');
        $('.ser-faq-ans-txt').slideUp();
        $('.ser-faq-item-ques').on('click', (e) => {
            e.preventDefault();
            if ($(e.target).hasClass('active')) {
                $(e.target).parent().removeClass('active')
                $(e.target).removeClass('active');
                $(e.target).parent().find('.ser-faq-ans-txt').slideUp();
            } else {
                $('.ser-faq-item').removeClass('active');
                $('.ser-faq-item-ques').removeClass('active');
                $('.ser-faq-ans-txt').slideUp();
                $(e.target).parent().addClass('active')
                $(e.target).addClass('active');
                $(e.target).parent().find('.ser-faq-ans-txt').slideDown();
            }
        });
        if ($(window).width() > 479) {
            $('.ser-trans-tab-item').on('click', (e) => {
                e.preventDefault();
                $('.ser-trans-tab-item').removeClass('active');
                $('.ser-trans-content-item').removeClass('active');
                let targetTab = $(e.target).data('tab');
                $(`.ser-trans-tab-item[data-tab=${targetTab}`).addClass('active');
                $(`.ser-trans-content-item[data-tab=${targetTab}`).addClass('active');
                let rocketTrail = $(e.target).data('rocket');
                $('.ser-trans-rocket-trail').css('width', `${rocketTrail}`);
            })
        } else {
            setTimeout(() => {
                let tlSerTransMb = new gsap.timeline({
                    scrollTrigger: {
                        trigger: '.ser-trans-contents',
                        scrub: .1,
                        start: "top top",
                        end: "bottom bottom",
                    }
                });
                tlSerTransMb.to('.ser-trans-progress-inner', { height: '100%', ease: 'none' });
            }, 1000);
        };

        if ($(window).width() > 479) {
            const tlSerFeelBg = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-ser-feels',
                    scrub: 0.4,
                    start: "top top",
                    end: "bottom top",
                }
            })
            tlSerFeelBg.to('.ser-feel-bg', { yPercent: -30, ease: 'none' })
        }

        function serRevOnScroll() {
            const tlSerHeroBg = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-ser-hero',
                    scrub: 0.4,
                    start: "top top",
                    end: "bottom top",
                }
            });
            tlSerHeroBg.to('.ser-hero-bg-img', { y: 0, ease: 'none' })
                .to('.ser-hero-planet-1', { yPercent: 20, ease: 'none' }, 0)
                .to('.ser-hero-planet-2', { yPercent: 25, ease: 'none' }, 0)

            let txtSerTransSub = new SplitText('.ser-trans-sub', { type: 'lines' })
            let txtSerTransContent = new SplitText($('.ser-trans-content-body').eq(0).find('.ser-trans-body-txt'), { type: 'lines' })
            const tlSerTrans = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-ser-trans',
                    start: 'top 65%',
                },
                onComplete: () => {
                    txtSerTransSub.revert()
                    txtSerTransContent.revert();
                }
            });
            tlSerTrans.from('.ser-trans-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' })
                .from('.ser-trans-title', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtSerTransSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.ser-trans-tab-label', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '<=.3')
                .from('.ser-trans-label-mb', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '<=.2')
                .from('.ser-trans-progress-outer', { y: 40, autoAlpha: 0, duration: 0.6, ease: 'easeAnim' }, '<=.1')
                .from('.ser-trans-tab-title', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '<=.1')
                .from('.ser-trans-rocket-wrap', { width: '0%', autoAlpha: 0, duration: .6, clearProps: 'all' }, '<=.3')
                .from('.ser-trans-rocket', { xPercent: -60, autoAlpha: 0, duration: .8, ease: 'easeAnim' }, '<=.3')
                .from($('.ser-trans-body-label').eq(0), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' }, '<=0')
                .from($('.ser-trans-content-body').eq(0).find('.ser-trans-body-title'), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all', stagger: .1 }, '-=.4')
                .from(txtSerTransContent.lines, { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all', stagger: .1 }, '<=.1')
                .from($('.ser-trans-content-img').eq(0), { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '<=.4')

            let txtSerFeelTitle = new SplitText('.ser-feel-title', { type: 'lines' })
            const tlSerFeel = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-ser-feels',
                    start: 'top 65%'
                },
                onComplete: () => {
                    txtSerFeelTitle.revert()
                }
            });
            tlSerFeel.from('.ser-feel-label', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' })
                .from(txtSerFeelTitle.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.ser-feel-btn', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')

            let txtSerFaqSub = new SplitText('.ser-faq-sub', { type: 'lines' })
            const tlSerFaq = new gsap.timeline({
                scrollTrigger: {
                    trigger: '.sc-ser-faq',
                    start: 'top 65%',

                },
                onComplete: () => {
                    txtSerFaqSub.revert()
                }
            });
            tlSerFaq.from('.ser-faq-svg', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.8, clearProps: 'all' }, '<=.2')
                .from('.ser-faq-title', { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all' }, '-=.3')
                .from(txtSerFaqSub.lines, { yPercent: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, stagger: 0.1 }, '-=.3')
                .from('.ser-faq-item-ques', { y: 50, autoAlpha: 0, ease: 'easeAnim', duration: 0.6, clearProps: 'all', stagger: .1 }, '-=.3')
                .from('.ser-faq-item', { borderBottom: '1px solid hsla(0, 0%, 100%, 0)', stagger: 0.1, clearProps: 'all' }, '<=.2')
        };
        serRevOnScroll();
    }
}

function contactScript() {
    if ($('.contactpage').length) {
        console.log('Welcome to contactpage');
        $('.sky-wrap').removeClass('hidden');
        contactForm();
        $('.success-close').on('click', (e) => {
            e.preventDefault();
            $('.success-wrap').removeClass('show');
        })
    }
}

function contactForm() {
    function handleSubmit() {
        function mapFormToObject(ele) {
            return (parsedFormData = [...new FormData(ele).entries()].reduce(
                (prev, cur) => {
                    const name = cur[0];
                    const val = cur[1];
                    return { ...prev, [name]: val };
                },
                {}
            ));
        }
        $('.form-contact-main .form-wrap').on('submit', (e) => {
            e.preventDefault();
            const formObject = mapFormToObject(e.target);
            console.log('submit')
            const data = {
                fields: [
                    {
                        name: 'firstname',
                        value: formObject.firstname,
                    },
                    {
                        name: 'lastname',
                        value: formObject.lastname,
                    },
                    {
                        name: 'email',
                        value: formObject.email,
                    },
                    {
                        name: 'phone',
                        value: formObject.phone,
                    },
                    {
                        name: 'message',
                        value: formObject.message,
                    }
                ],
                context: {
                    pageUri: window.location.href,
                    pageName: 'Contact Page',
                },
            };
            const sendSubmitURL = `https://api.hsforms.com/submissions/v3/integration/submit/8605188/e9c7301f-5a0c-4fb3-812b-55a13ab73f40`;
            const final_data = JSON.stringify(data);
            $.ajax({
                url: sendSubmitURL,
                method: 'POST',
                data: final_data,
                dataType: 'json',
                headers: {
                    accept: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                contentType: 'application/json',
                success: function (response) {
                    let name = `${data.fields[0].value} ${data.fields[1].value}`;
                    console.log(name);
                    formSuccess(name);

                    console.log('done');
                },
                error: function (error) {
                    formError(error);
                },
            });
        });
    }
    handleSubmit();

    function formSuccess(name) {
        console.log(name);
        $('.success-name').text(name);
        document.querySelector('.form-contact-main .form-wrap').reset();
        $('.success-wrap').addClass('show');
        setTimeout(() => {
            $('.success-wrap').removeClass('show');
        }, 5000);
    };
    function formError(error) {
        let errors = error.responseJSON.errors;
        for (x = 0; x < errors.length; x++) {
            let errType = errors[x].errorType
            if (errType == 'BLOCKED_EMAIL' || errType == 'INVALID_EMAIL') {
                alert('Try again with a valid email');
                return;
            } else if (errType == 'NUMBER_OUT_OF_RANGE') {
                alert('Try again with a valid phone number');
                return;
            }
        }
    }
    function inputCheck(ele) {
        let parent = ele.parent();
        let value = ele.val();
        if (value != '') {
            parent.addClass('filled');
        } else {
            parent.removeClass('filled');
        }
    }
    $('.contact-form-input, .contact-form-textarea').on('keyup change focus blur', (e) => {
        inputCheck($(e.target));
    })
    $("textarea").each(function () {
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
        this.setAttribute("rows", "1");
    }).on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });
}

function notFoundScript() {
    if ($('._404page').length) {
        console.log('Welcome to notfoundpage');
        $('.sky-wrap').removeClass('hidden');
    }
}
function termScript() {
    if ($('.termpage').length) {
        console.log('Welcome to termpage');
        handleTermScroll();
        setTimeout(() => {
            let observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const id = entry.target.getAttribute("id");
                    if (entry.isIntersecting) {
                        document.querySelectorAll(".active").forEach((z) => {
                            z.classList.remove("active")
                        });
                        document.querySelector(`a[href="#${id}"]`).classList.add("active");
                    }
                });
            }, { rootMargin: '0px 0px -75% 0px' });

            document.getElementById("content").querySelectorAll("h3").forEach(function (heading, i) {
                observer.observe(heading);
                heading.setAttribute("id", "toc-" + i);
                const item = document.createElement("a");
                item.innerHTML = heading.innerHTML
                item.setAttribute("class", "text-16 term-nav-item");
                item.setAttribute("href", "#toc-" + i);
                document.querySelector("#toc").appendChild(item);
            });
        }, 1000)

    }
}